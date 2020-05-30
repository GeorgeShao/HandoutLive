<template>
  <div>
    <v-card height="100vh">
      <v-app-bar>
        <v-app-bar-nav-icon @click="studentDrawer = true" />
        <v-toolbar-title>TeacherTrainer</v-toolbar-title>
        <v-spacer/>
        <v-icon @click="messageDrawer = true">mdi-account</v-icon>
      </v-app-bar>

      <v-content style="height: 100vh">
        <div class="content">
          <v-navigation-drawer
            v-model="studentDrawer"
            absolute
          >
            <template v-slot:prepend>
              <v-list-item two-line>
                <v-list-item-avatar>
                  <img src="https://randomuser.me/api/portraits/women/81.jpg">
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>Jane Smith</v-list-item-title>
                  <v-list-item-subtitle>Logged In</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-divider></v-divider>
          </v-navigation-drawer>

          <v-sheet class="canvas">
            <DrawingCanvas />
          </v-sheet>

          <v-card width="200px">
            <template v-slot:prepend>
              <v-list-item two-line>
                <v-list-item-avatar>
                  <img src="https://randomuser.me/api/portraits/women/81.jpg">
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>Jane Smith</v-list-item-title>
                  <v-list-item-subtitle>Logged In</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-divider></v-divider>
          </v-card>
        </div>
      </v-content>
    </v-card>
  </div>
</template>

<script>
import DrawingCanvas from '../components/DrawingCanvas';

export default {
  name: 'TeacherPage',
  components: { DrawingCanvas },
  data: () => ({
    studentDrawer: false,
    messageDrawer: false
  })
}
</script>

<style>
  .content {
    display: flex;
    height: 100vh;
    flex-direction: row;
  }

  .canvas {
    flex-grow: 1;
  }
</style>
