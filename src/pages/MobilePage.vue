<template>
  <div class="wrapper">
    <DrawingCanvas/>
  </div>
</template>

<script>
  import DrawingCanvas from "../components/DrawingCanvas";

  export default {
    name: "MobilePage",
    components: {DrawingCanvas},
  }
</script>

<style>
  .wrapper {
    width: 100vw;
    height: 100vh;
  }
</style>