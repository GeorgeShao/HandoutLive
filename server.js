const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const port = process.env.PORT || 4000;

const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ rooms: [], users: [] }).write();

server.listen(port, () => console.log(`App listening at port ${port}`));

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected!`);

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected!`);
    const roomCode = db.get('users').find({ id: socket.id }).get('roomCode').value();
    const room = db.get('rooms').find({ code: roomCode });
    const teacherId = room.get('teacherId').value();
    if (teacherId === socket.id) {
      db.get('rooms').remove({ code: roomCode }).write();
      socket.to(roomCode).emit('teacherLeft');
    } else {
      room.get('studentIds').remove(socket.id).write();
      socket.to(teacherId).emit('studentLeft', socket.id);
    }
  });

  socket.on('addStudentLines', (userId, lines) => {
    console.log(`User ${userId} drew lines: ${lines}`);
    // const roomCode = db.get('users').find({id: userId}).get('roomCode').value();
    // const teacherId = db.get('rooms').find({code: roomCode}).get('teacherId').value();
    socket.broadcast.emit('addStudentLines', userId, lines);
  });

  socket.on('addTeacherLines', (userId, lines) => {
    console.log(`Teacher drew to ${userId} some lines: ${lines}`);
    socket.to(userId).emit('addTeacherLines', lines);
  });

  socket.on('createRoom', ({userName, roomCode}, ack) => {
    console.log(`Attempting to create room with code ${roomCode}...`);
    if (db.get('rooms').find({ code: roomCode }).value() !== undefined) {
      return ack({success: false, message: "Room already exists."});
    }
    socket.join(roomCode);
    db.get('rooms').push({
      code: roomCode,
      studentIds: [],
      teacherId: socket.id
    }).write();

    db.get('users').push({
      id: socket.id,
      name: userName,
      roomCode,
      deviceId: '',
    }).write();

    return ack({ success: true });
  });

  socket.on('joinRoom', ({userName, roomCode}, ack) => {
    console.log(`User ${socket.id} joining room ${roomCode}...`);
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

    room.get('users').push({
      id: socket.id,
      name: userName,
      deviceId: '',
      roomCode
    }).write();

    room.get('studentIds').push(socket.id).write();

    return ack({ success: true });
  });
});


