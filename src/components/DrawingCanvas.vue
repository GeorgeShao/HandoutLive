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
import { mapState, mapActions, mapGetters } from 'vuex';

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
      console.log(lines);
      this.addLines({ id: this.getTeacherId(), lines });
      this.paintLines(lines);
    });

    this.$socket.on('addTeacherImage', (image) => {
      this.uploadImage(image);
    });

    this.$socket.on('addStudentLines', (studentId, lines) => {
      this.addLines({ id: studentId, lines });
      if (this.currentStudentId === studentId) {
        this.paintLines(lines);
      }
    });

    this.$socket.on('changedCanvas', (lines) => {
      if (this.isTeacher) {
        this.clearCanvas();
        this.paintLines(lines);
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
    paintLines(lines) {
      lines.forEach((line) => {
        this.paint(line.start, line.stop);
      })
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
        this.addLines({ id: this.currentStudentId, lines: this.linesBuffer });
        if (this.isTeacher) {
          this.$socket.emit('addTeacherLines', this.currentStudentId, this.linesBuffer);
        } else {
          this.$socket.emit('addStudentLines', this.userId, this.linesBuffer);
        }
        this.linesBuffer = [];
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
    ...mapActions(['addLines']),
  },
  computed: {
    ...mapState(['isTeacher', 'currentStudentId', 'userId']),
    ...mapGetters(['getTeacherId'])
  },
}
</script>

<style scoped>
  .canvas {
    border: 1px solid black;
  }
</style>
