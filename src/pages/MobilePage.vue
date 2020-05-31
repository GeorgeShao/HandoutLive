<template>
  <div>
  <div class="wrapper" ref="wrapper" :style="{ left: `${left}px`, top: `${top}px`}">
    <div
      class="canvas-container"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseout="onMouseUp"
      @mouseup="onMouseUp"
      style="position: relative"
    >
      <DrawingCanvas :disabled="!isEditMode" />
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
import {mapActions} from "vuex";

export default {
  name: "MobilePage",
  components: {DrawingCanvas},
  data: () => ({
    isEditMode: false,
    isPressing: false,
    left: 0,
    top: 0
  }),
  methods: {
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
      const { offsetX, offsetY } = event;
      this.prevPos = { x: offsetX, y: offsetY };
    },
    onMouseMove(event) {
      if (!this.isPressing || this.isEditMode) return;
      const { offsetX: x, offsetY: y } = event;
      const offsetData = { x, y };
      this.move(this.prevPos, offsetData);
      this.prevPos = { x, y };
    },
    onMouseUp() {
      if (this.isPressing) {
        this.isPressing = false;
      }
    },
    async addLines() {
      if (this.isTeacher) {
        this.$socket.emit('addTeacherLines', this.currentStudentId, this.linesBuffer);
      } else {
        this.$socket.emit('addStudentLines', this.$socket.id, this.linesBuffer);
      }
      this.linesBuffer = [];
    },
    uploadImage(url) {
      const ctx = this.setCanvasContext();
      const img = new Image();
      img.src = url;
      img.onload = function() {
        ctx.drawImage(img, 0, 0);
      }
    },
    clearCanvas() {
      const canvas = this.$refs.canvas;
      const ctx = this.setCanvasContext();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    ...mapActions(['addStudentLines'])
  }
}
</script>

<style scoped>
.wrapper {
   position: absolute;
}

.canvas-container {
  width: 100vw;
  height: 100vh;
}
</style>
