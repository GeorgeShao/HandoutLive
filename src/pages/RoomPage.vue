<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="studentSidebar = !studentSidebar" />
      <v-toolbar-title>TeacherTrainer</v-toolbar-title>
      <v-spacer />
      <v-icon>mdi-account</v-icon>
    </v-app-bar>

    <v-navigation-drawer app v-model="studentSidebar">
      <v-list>
        <v-subheader v-if="isTeacher">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Room Code: {{roomCode}}</v-list-item-title>
              <v-list-item-subtitle>Share this with your students</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-subheader>

        <v-subheader>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Connect Code: {{ connectCode }}</v-list-item-title>
              <v-list-item-subtitle>Use this code to connect to a device. Do not share this code.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-subheader>

        <v-divider />

        <v-list-item-group
          v-if="isTeacher"
          v-model="currentStudentPos"
          mandatory
        >
          <v-list-item v-for="(student, index) in students" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ student.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

        <v-list-item-group
          v-else
          v-model="currentStudentPos"
          mandatory
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Teacher</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ userName + ' (YOU)' }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <p v-if="students.length === 0" class="px-5">No students have joined yet...</p>
    </v-navigation-drawer>

    <v-content style="overflow: hidden">
      <div class="wrapper">

        <DrawingCanvas
          ref="drawingCanvas"
          :disabled="isTeacherCanvas || !isTeacher && currentStudentPos === 0"
        />

        <v-sheet>
          <v-card
            class="mx-auto"
            max-width="400"
            height="100%"
            tile
          >
            <v-list-item v-for="(message, index) in messages" :key="index" two-line>
              <v-list-item-content>
                <v-list-item-title>{{message.sender}}</v-list-item-title>
                <v-list-item-subtitle>{{message.contents}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <div class="send-message-container">
              <v-textarea
                solo
                label="Send a message..."
                class="send-message-box"
                hide-details
              ></v-textarea>
              <v-btn @click="sendMessage()" width="100%">Send</v-btn>
            </div>
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
      currentStudentPos: 0,
      isTeacherCanvas: false,
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
      // this.$router.push({ path: '/' });
    }
  },
  mounted() {
    this.setCurrentStudentId(this.getTeacherId());
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
      })
      .on('changedCanvas', ({studentPos}) => {
        if (!this.isTeacher) {
          this.isTeacherCanvas = studentPos === 0;
        }

        this.currentStudentPos = studentPos;
      });
  },
  computed: {
    ...mapState(['students', 'isTeacher', 'roomCode', 'userName', 'connectCode']),
    ...mapGetters(['getLinesByStudentId', 'getTeacherId']),
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
    currentStudentPos(studentPos) {
      const ctx = this.$refs.drawingCanvas.$refs.canvas.getContext('2d');
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      const drawingCanvas = this.$refs.drawingCanvas;
      const id = this.students[studentPos].id;
      const lines = this.getLinesByStudentId(id);
      this.$socket.emit('changedCanvas', {lines, studentPos});
      lines.forEach(line => drawingCanvas.paint(line.start, line.stop));
      this.setCurrentStudentId(id);
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

  .send-message-container {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
  }
</style>
