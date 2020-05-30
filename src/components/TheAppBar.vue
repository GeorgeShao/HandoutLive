<template>
  <v-app-bar>
    <v-app-bar-nav-icon @click="studentDrawer = true" />
    <v-toolbar-title>TeacherTrainer</v-toolbar-title>
    <v-spacer/>
    <v-icon>mdi-account</v-icon>
  </v-app-bar>
</template>

<script>
export default {
  name: 'TheAppBar',
}
</script>
