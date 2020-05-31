const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const port = process.env.PORT || 4000;
const { v4: uuidv4 } = require('uuid');

const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ rooms: [], users: [] }).write();

server.listen(port, () => console.log(`App listening at port ${port}`));

io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    const roomCode = db.get('users').find({ id: socket.id }).get('roomCode').value();
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
    socket.to(teacherId).emit('addStudentLines', userId, lines);
    const userDeviceId = user.get('deviceId').value();
    socket.to(userDeviceId).emit('addTeacherLines', lines);
    const teacherDeviceId = db.get('users').find({ id: teacherId }).get('deviceId').value();
    socket.to(teacherDeviceId).emit('addTeacherLines', lines);
  });

  socket.on('addTeacherLines', (userId, lines) => {
    const deviceId = db.get('users').find({id: userId}).get('deviceId').value();
    socket.to(userId).emit('addTeacherLines', lines);
    socket.to(deviceId).emit('addTeacherLines', lines);
  });

  socket.on('addTeacherImage', (userId, image) => {
    const deviceId = db.get('users').find({id: userId}).get('deviceId').value();
    socket.to(userId).emit('addTeacherImage', image);
    socket.to(deviceId).emit('addTeacherImage', image);
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

    const connectPassword = uuidv4().slice(0, 6);
    db.get('users').push({
      id: socket.id,
      name: userName,
      connectPassword,
      roomCode,
      deviceId: '',
    }).write();

    return ack({ success: true, connectPassword });
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
    socket.join(roomCode);
    socket.to(teacherId).emit('studentJoined', {
      id: socket.id,
      name: userName
    });

    const connectPassword = uuidv4().slice(0, 6);

    room.get('users').push({
      id: socket.id,
      name: userName,
      connectPassword,
      deviceId: '',
      roomCode
    }).write();

    room.get('studentIds').push(socket.id).write();

    return ack({ success: true, connectPassword });
  });

  socket.on('connectDevice', (password, ack) => {
    const user = db.get('users').find({ connectPassword: password });
    if (user.value() === undefined) {
      return ack({ success: false, message: 'Connect code not found.' });
    }

    if (user.get('deviceId').value() !== undefined) {
      return ack({ success: false, message: 'Connect code already used.' });
    }

    user.set('deviceId', socket.id).write();
    const room = db.get('rooms').find({ code: user.get('roomCode').value() });
    const isTeacher = room.get('teacherId').value() === user.get('id').value();
    return ack({ success: true, isTeacher });
  });
});


