<template>
  <canvas
    class="canvas"
    ref="canvas"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseleave="endPaintEvent"
    @mouseup="endPaintEvent"
  />
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'DrawingCanvas',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    prevPos: { x: 0, y: 0 },
    curPos: { x: 0, y: 0 },
    isPainting: false,
    lines: [],
    linesBuffer: [],
    lineColor: '#000000',
    lineWidth: 5
  }),
  mounted() {
    const canvas = this.$refs.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    this.$socket.on('addTeacherLines', (lines) => {
      lines.forEach((line) => {
        this.paint(line.start, line.stop);
      });
    });

    this.$socket.on('addTeacherImage', (image) => {
      this.uploadImage(image);
    });

    this.$socket.on('addStudentLines', (studentId, lines) => {
      this.addStudentLines({
        studentId,
        lines
      })

      if (this.currentStudentId === studentId) {
        lines.forEach((line) => {
          this.paint(line.start, line.stop);
        })
      }
    });
  },
  methods: {
    paint(prevPos, curPos) {
      const ctx = this.setCanvasContext();
      ctx.beginPath();
      ctx.moveTo(prevPos.x, prevPos.y);
      ctx.lineTo(curPos.x, curPos.y);
      ctx.stroke();
    },
    onMouseDown(event) {
      if (this.disabled) return;
      const { offsetX, offsetY } = event;
      this.isPainting = true;
      this.prevPos = { x: offsetX, y: offsetY };
    },
    onMouseMove(event) {
      if (this.disabled) return;
      if (!this.isPainting) return;
      const { offsetX: x, offsetY: y } = event;
      const offsetData = { x, y };
      const line = {
        start: { ...this.prevPos },
        stop: { ...offsetData }
      };
      this.linesBuffer.push(line);
      this.paint(this.prevPos, offsetData);
      this.prevPos = { x, y };
    },
    endPaintEvent() {
      if (this.disabled) return;
      if (this.isPainting) {
        this.isPainting = false;
        this.addLines();
      }
    },
    setCanvasContext() {
      const ctx = this.$refs.canvas.getContext('2d');
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = this.lineColor;
      ctx.lineWidth = this.lineWidth;
      return ctx;
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
  },
  computed: mapState(['isTeacher', 'currentStudentId'])
}
</script>

<style scoped>
  .canvas {
    border: 1px solid black;
  }
</style>
