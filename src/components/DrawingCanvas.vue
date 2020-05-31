<template>
  <canvas
    ref="canvas"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseleave="endPaintEvent"
    @mouseup="endPaintEvent"
  />
</template>

<script>
export default {
  name: 'DrawingCanvas',
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
  },
  methods: {
    paint(prevPos, curPos) {
      const ctx = this.setCanvasContext();
      ctx.beginPath();
      ctx.moveTo(prevPos.x, prevPos.y);
      ctx.lineTo(curPos.x, curPos.y);
      ctx.stroke();
      this.prevPos = { x: curPos.x, y: curPos.y };
    },
    onMouseDown(event) {
      const { offsetX, offsetY } = event;
      this.isPainting = true;
      this.prevPos = { x: offsetX, y: offsetY };
      this.linesBuffer.push({
        start: { ...this.prevPos },
        stop: { ...this.prevPos }
      });
    },
    onMouseMove(event) {
      if (!this.isPainting) return;
      const { offsetX: x, offsetY: y } = event;
      const offsetData = { x, y };
      const line = {
        start: { ...this.prevPos },
        stop: { ...offsetData }
      };
      this.linesBuffer.push(line);
      this.paint(this.prevPos, offsetData);
    },
    endPaintEvent() {
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
      this.$socket.emit('addLines', this.linesBuffer);
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
    }
  }
}
</script>
