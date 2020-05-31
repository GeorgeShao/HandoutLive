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
