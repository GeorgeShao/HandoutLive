<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="studentSidebar = !studentSidebar" v-if="isTeacher" />
      <v-toolbar-title>TeacherTrainer</v-toolbar-title>
      <v-spacer />
      <v-icon>mdi-account</v-icon>
    </v-app-bar>

    <v-navigation-drawer app v-model="studentSidebar" v-if="isTeacher">
      <v-list>
        <v-subheader>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Room Code: {{roomCode}}</v-list-item-title>
              <v-list-item-subtitle>Share this with your students</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-subheader>

        <v-divider />

        <v-list-item-group v-model="currentStudentId">
          <v-list-item v-for="(student, index) in students" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ student.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <p v-if="students.length === 0" class="px-5">No students have joined yet...</p>
    </v-navigation-drawer>

    <v-content style="overflow: hidden">
      <div class="wrapper">

        <DrawingCanvas ref="drawingCanvas" />

        <v-sheet>
          <v-card
            class="mx-auto"
            max-width="400"
            height="100%"
            tile
          >
            <v-list-item v-for="message in messages" :key="message.id + message.contents + message.sender" two-line>
              <v-list-item-content>
                <v-list-item-title>{{message.sender}}</v-list-item-title>
                <v-list-item-subtitle>{{message.contents}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-text-field
              label="Solo"
              v-model="messageField"
              placeholder="Placeholder"
              solo
            ></v-text-field>
            <v-btn @click="sendMessage()">Send</v-btn>
          </v-card>
        </v-sheet>
      </div>
      <v-btn
        v-if="isTeacher"
        absolute
        dark
        fab
        bottom
        left
        style="margin-bottom: 40px"
        color="blue"
        @click="openUploadFileDialog()"
      >
        <v-icon>mdi-upload</v-icon>
      </v-btn>

    </v-content>
  </v-app>
</template>
<script>
import DrawingCanvas from '../components/DrawingCanvas';
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'RoomPage',
  components: { DrawingCanvas },
  data() {
    return {
      studentSidebar: false,
      messageSidebar: false,
      messageField: "",
      currentStudentId: this.$store.state.currentStudentId,
      messages: [
        {
          id: 0,
          sender: "PersonalBot",
          contents: "Welcome to PersonalTeacher!",
        },
      ]
    };
  },
  created() {
    if (this.students.length === 0) {
      //this.$router.push({ path: '/' });
    }
  },
  mounted() {
    this.$socket
      .on('studentJoined', (student) => {
        this.addStudent(student);
      })
      .on('studentLeft', (studentId) => {
        this.removeStudent(studentId);
      })
      .on('teacherLeft', () => {
        this.resetState();
        this.$router.push({ path: '/' });
      })
      .on('sendMessage', (message) => {
        this.messages.push(message);
      });
  },
  computed: {
    ...mapState(['students', 'isTeacher', 'roomCode', 'userName']),
    ...mapGetters(['getLinesByStudentId'])
  },
  methods: {
    ...mapActions(['addStudent', 'removeStudent', 'setCurrentStudentId', 'resetState']),
    openUploadFileDialog() {
      var fileSelector = document.createElement('input');
      fileSelector.setAttribute('type', 'file');
      fileSelector.click();
      fileSelector.addEventListener("change", handleFiles, false);
      const canvas = this.$refs.drawingCanvas;
      const studentId = this.$store.state.currentStudentId;
      const socket = this.$socket;
      function handleFiles() {
        const fileData = this.files[0];
        const fileUrl = URL.createObjectURL(fileData);
        canvas.uploadImage(fileUrl);
        socket.emit('addTeacherImage', studentId, fileUrl);
      }
    },
    sendMessage() {
      if (this.messageField) {
        const messageObj = {
          id: Math.floor(Math.random() * 10000),
          sender: this.userName,
          contents: this.messageField,
        }
        this.messages.push(messageObj);
        this.$socket.emit('sendMessage', this.roomCode, messageObj);
        this.messageField = "";
      }
    }
  },
  watch: {
    currentStudentId(studentPos) {
      const studentId = this.students[studentPos].id;
      const drawingCanvas = this.$refs.drawingCanvas;
      const ctx = this.$refs.drawingCanvas.$refs.canvas.getContext('2d');
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      const lines = this.getLinesByStudentId(studentId);
      lines.forEach(line => drawingCanvas.paint(line.start, line.stop));
      this.setCurrentStudentId(studentId);
    }
  }
}
</script>

<style>
  .wrapper {
    display: flex;
    height: 100%;
    overflow: hidden;
  }
</style>
