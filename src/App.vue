<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>

<style>
  html, body {
    overflow: hidden;
  }

  body {
    position: relative;
    height: 100vh;
    width: 100vw;
  }
</style>
