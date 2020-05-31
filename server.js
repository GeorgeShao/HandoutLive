const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const port = process.env.PORT || 4000;
const { v4: uuidv4 } = require('uuid');

const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ rooms: [], users: [], devices: [] }).write();

server.listen(port, () => console.log(`App listening at port ${port}`));

io.on('connection', (socket) => {
  function getUserId() {
    const device = db.get('devices').find({ id: socket.id }).value();
    if (device === undefined) return socket.id;
    else return db.get('users').find({ id: device.userId }).get('id').value();
  }

  socket.on('disconnect', () => {
    const user = db.get('users').find({ id: socket.id });
    if (user === undefined) {
      db.get('devices').remove({ id: socket.id });
      return;
    }
    const roomCode = user.get('roomCode').value();
    const room = db.get('rooms').find({ code: roomCode });
    const teacherId = room.get('teacherId').value();
    db.get('users').remove({ id: socket.id });
    if (teacherId === socket.id) {
      room.get('studentIds').each(studentId => {
        db.get('users').find({ id: studentId }).set('roomCode', '').write();
      });
      db.get('rooms').remove({ code: roomCode }).write();
      socket.to(roomCode).emit('teacherLeft');
    } else {
      room.get('studentIds').remove(socket.id).write();
      socket.to(teacherId).emit('studentLeft', socket.id);
    }
  });

  socket.on('addStudentLines', (userId, lines) => {
    const user = db.get('users').find({id: userId});
    const roomCode = user.get('roomCode').value();
    const teacherId = db.get('rooms').find({code: roomCode}).get('teacherId').value();
    const userDeviceId = user.get('deviceId').value();
    const teacherDeviceId = db.get('users').find({ id: teacherId }).get('deviceId').value();
    socket.to(userId).emit('addStudentLines', userId, lines);
    socket.to(teacherId).emit('addStudentLines', userId, lines);
    socket.to(userDeviceId).emit('addTeacherLines', lines);
    socket.to(teacherDeviceId).emit('addTeacherLines', lines);
  });

  socket.on('addTeacherLines', (userId, lines) => {
    const teacherId = getUserId();
    if (userId === teacherId) {
      const roomCode = db.get('users').find({ id: userId }).get('roomCode').value();
      // only send teacher lines to the teacher canvas
      return socket.to(roomCode).emit('addStudentLines', userId, lines);
    }
    const deviceId = db.get('users').find({id: userId}).get('deviceId').value();
    socket.to(userId).emit('addStudentLines', userId, lines);
    socket.to(deviceId).emit('addStudentLines', userId, lines);
  });

  socket.on('addTeacherImage', (userId, image) => {
    const deviceId = db.get('users').find({id: userId}).get('deviceId').value();
    socket.to(userId).emit('addTeacherImage', image);
    socket.to(deviceId).emit('addTeacherImage', image);
  });

  socket.on('sendMessage', (roomCode, message) => {
    socket.to(roomCode).emit('sendMessage', message);
  });

  socket.on('changedCanvas', ({ lines, studentPos }) => {
    const deviceId = db.get('users').find({ id: socket.id }).get('deviceId').value();
    socket.to(deviceId).emit('changedCanvas', { lines, studentPos });
  });

  socket.on('createRoom', ({userName, roomCode}, ack) => {
    if (db.get('rooms').find({ code: roomCode }).value() !== undefined) {
      return ack({success: false, message: "Room already exists."});
    }
    socket.join(roomCode);
    db.get('rooms').push({
      code: roomCode,
      studentIds: [],
      teacherId: socket.id
    }).write();

    const connectCode = uuidv4().slice(0, 6);
    db.get('users').push({
      id: socket.id,
      name: userName,
      connectCode,
      roomCode,
      deviceId: '',
    }).write();

    return ack({ success: true, connectCode });
  });

  socket.on('joinRoom', ({userName, roomCode}, ack) => {
    const room = db.get('rooms').find({ code: roomCode });
    if (room.value() === undefined) {
      return ack({
        success: false,
        message: "Room doesn't exist."
      });
    }
    const teacherId = room.get('teacherId').value();
    const teacher = db.get('users').find({ id: teacherId });

    socket.join(roomCode);
    socket.to(teacherId).emit('studentJoined', {
      id: socket.id,
      name: userName,
    });

    const connectCode = uuidv4().slice(0, 6);

    db.get('users').push({
      id: socket.id,
      name: userName,
      connectCode,
      deviceId: '',
      roomCode
    }).write();

    room.get('studentIds').push(socket.id).write();

    return ack({
      success: true,
      connectCode,
      teacherId,
      teacherName: teacher.get('name').value()
    });
  });

  socket.on('connectDevice', (connectCode, ack) => {
    const user = db.get('users').find({ connectCode });
    if (user.value() === undefined) {
      return ack({ success: false, message: 'Connect code not found.' });
    }

    if (user.get('deviceId').value()) {
      return ack({ success: false, message: 'Connect code already used.' });
    }


    db.get('devices').push({
      id: socket.id,
      userId: user.get('id').value()
    }).write();
    user.set('deviceId', socket.id).write();

    const roomCode = user.get('roomCode').value();
    const userId = user.get('id').value();

    socket.join(roomCode);
    socket.join(user.get('id').value());

    const room = db.get('rooms').find({ code: roomCode });
    const isTeacher = room.get('teacherId').value() === user.get('id').value();
    return ack({ success: true, isTeacher, userId });
  });
});


