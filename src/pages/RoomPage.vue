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
              <v-list-item-title>Room Code: MAH IEM</v-list-item-title>
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
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>John Doe</v-list-item-title>
                <v-list-item-subtitle>How do you do question #3?</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Jane Smith</v-list-item-title>
                <v-list-item-subtitle>I don't understand question #5</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Tommy Chen</v-list-item-title>
                <v-list-item-subtitle>Can you show me how to do #7?</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-text-field
              label="Solo"
              placeholder="Placeholder"
              solo
            ></v-text-field>
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
      currentStudentId: this.$store.state.currentStudentId
    };
  },
  mounted() {
    this.addStudent({
      id: this.$socket.id,
      name: this.userName
    })
    this.$socket
      .on('studentJoined', (student) => {
        this.addStudent(student);
      })
      .on('studentLeft', (studentId) => {
        this.removeStudent(studentId);
      })
      .on('teacherLeft', () => {
        this.$router.push({ path: '/' });
      });

    this.$socket.on('addStudentLines', (studentId, lines) => {
      this.addStudentLines({
        studentId,
        lines
      });
    });
  },
  computed: {
    ...mapState(['students', 'isTeacher']),
    ...mapGetters(['getLinesByStudentId'])
  },
  methods: {
    ...mapActions(['addStudent', 'removeStudent', 'addStudentLines']),
    openUploadFileDialog() {
      var fileSelector = document.createElement('input');
      fileSelector.setAttribute('type', 'file');
      fileSelector.click();
      fileSelector.addEventListener("change", handleFiles, false);
      const canvas = this.$refs.drawingCanvas;
      function handleFiles() {
        var fileData = this.files[0];
        canvas.uploadImage(URL.createObjectURL(fileData));
        console.log("fileData:", fileData);
      }
    },
  },
  watch: {
    currentStudentId(studentPos) {
      const studentId = this.students[studentPos].id;
      const ctx = this.$refs.drawingCanvas.$refs.canvas.getContext('2d');
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      const lines = this.getLinesByStudentId(studentId);
      lines.forEach(line => this.paint(line.start, line.stop));
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
