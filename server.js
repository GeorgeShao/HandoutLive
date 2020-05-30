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
  socket.on('addLines', (lines, userId) => {
    // Student is drawing lines
    if (!userId) {
      const roomCode = db.get('users').find({ id: socket.id }).get('roomCode').value();
      const teacherId = db.get('rooms').find({ code: roomCode }).get('teacherId').value();
      socket.to(teacherId).emit('addStudentLines', socket.id, lines);
    }
    // Teacher is drawing lines for student
    else {
      socket.to(userId).emit('addTeacherLines', lines);
    }
  });

  socket.on('createRoom', (roomCode, ack) => {
    if (db.get('rooms').find({ code: roomCode }).value() !== undefined) {
      return ack({success: false, message: "Room already exists."});
    }
    socket.join(roomCode);
    db.get('rooms').push({
      code: roomCode,
      students: [],
      teacher: {
        id: socket.id,
        deviceId: ''
      }
    }).write();
    return ack({ success: true });
  });

  socket.on('joinRoom', (roomCode, ack) => {
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
    socket.to(teacherId).emit('studentJoined', socket.id);
    room.get('students').push({
      id: socket.id,
      deviceId: '',
      roomCode
    }).write();
    return ack({ success: true });
  });
});


