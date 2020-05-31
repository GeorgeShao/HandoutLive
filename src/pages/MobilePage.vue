<template>
  <div>
  <div class="wrapper" ref="wrapper" :style="{ left: `${left}px`, top: `${top}px`}">
    <div
      class="canvas-container"
      @pointerdown="onMouseDown"
      @pointermove="onMouseMove"
      @pointerout="onMouseUp"
      @pointerup="onMouseUp"
      style="position: relative"
    >
      <DrawingCanvas :disabled="!isEditMode" ref="mobileDrawingCanvas" />
    </div>
  </div>
  <v-btn
    style="margin-top: 32px"
    absolute
    small
    fab
    top
    right
    icon
    @click="toggleEditMode()"
  >
    <v-icon>{{ isEditMode ? 'mdi-pencil' : 'mdi-camera-control' }}</v-icon>
  </v-btn>
  </div>
</template>

<script>
import DrawingCanvas from "../components/DrawingCanvas";
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: "MobilePage",
  components: {DrawingCanvas},
  data: () => ({
    isEditMode: false,
    isPressing: false,
    curPos: {x: 0, y: 0},
    prevPos: {x: 0, y: 0},
    left: 0,
    top: 0
  }),

  mounted() {
    console.log('hi');
    this.$socket.on('changedCanvas', ({studentPos, lines}) => {
      if (this.isTeacher) {
        const drawingCanvas = this.$refs.mobileDrawingCanvas;
        console.log(drawingCanvas);
        drawingCanvas.clearCanvas();
        drawingCanvas.paintLines(lines);
        this.currentStudentPos = studentPos;
        const id = this.students[studentPos].id;
        this.setCurrentStudentId(id);
      }
    });
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
      });
  },
  computed: {
    ...mapGetters(['getLinesByStudentId']),
    ...mapState(['isTeacher', 'students'])
  },
  methods: {
    ...mapActions(['setCurrentStudentId', 'addStudent', 'removeStudent', 'resetState']),
    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
    },
    move(prevPos, curPos) {
      const xInc = curPos.x - prevPos.x;
      const yInc = curPos.y - prevPos.y;
      this.left += xInc;
      this.top += yInc;
    },
    onMouseDown(event) {
      if (this.isEditMode) return;
      this.isPressing = true;
      const { pageX, pageY } = event;
      this.prevPos = { x: pageX, y: pageY };
    },
    onMouseMove(event) {
      if (!this.isPressing || this.isEditMode) return;
      const {pageX: x, pageY: y} = event;
      const offsetData = {x, y};
      this.move(this.prevPos, offsetData);
      this.prevPos = {x, y};
    },
    onMouseUp() {
      if (this.isPressing) {
        this.isPressing = false;
      }
    }
  }
}
</script>

<style scoped>
.wrapper {
   position: absolute;
}

.canvas-container {
  width: 1000px;
  height: 1000px;
}
</style>
