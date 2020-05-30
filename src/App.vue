<template>
  <v-app>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>
