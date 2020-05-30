<template>
  <div style="height: 100vh; display: flex; flex-direction: column">
    <TheAppBar />
    <div style="flex-grow: 1">
      <div class="content">
        <v-navigation-drawer
          v-model="studentDrawer"
          @click="studentDrawer = !studentDrawer"
        >
          <v-divider />
          <template v-slot:prepend>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Room Code: MAH IEM</v-list-item-title>
                <v-list-item-subtitle>Share this with your students</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>

          <v-divider />

          <v-list-item two-line>
            <v-list-item-avatar>
              <img src="https://randomuser.me/api/portraits/women/81.jpg">
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>Jane Smith</v-list-item-title>
              <v-list-item-subtitle>Logged In</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-navigation-drawer>

        <v-sheet class="canvas">
          <DrawingCanvas />
        </v-sheet>

        <v-card width="200px">
          <v-card
            class="mx-auto"
            max-width="400"
            tile
          >
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>John Doe</v-list-item-title>
                <v-list-item-subtitle>How do you do question #3?</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Jane Smith</v-list-item-title>
                <v-list-item-subtitle>I don't understand question #5</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Tommy Chen</v-list-item-title>
                <v-list-item-subtitle>Can you show me how to do #7?</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

          </v-card>

          <v-divider></v-divider>

          <v-text-field
            label="Solo"
            placeholder="Placeholder"
            solo
          ></v-text-field>
        </v-card>
      </div>

      <!--
      <v-btn
        absolute
        dark
        fab
        bottom
        left
        color="blue"
      >
        <v-icon>mdi-upload</v-icon>
      </v-btn>
      -->
    </div>
  </div>
</template>
<script>
  import DrawingCanvas from '../components/DrawingCanvas';
  import TheAppBar from "../components/TheAppBar";

  export default {
    name: 'TeacherPage',
    components: {TheAppBar, DrawingCanvas },
    data: () => ({
      studentDrawer: true,
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
