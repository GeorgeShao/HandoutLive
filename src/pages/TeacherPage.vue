<template>
  <div>
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

      <v-card-text style="height: 300px" class="grey lighten-5"></v-card-text>
      <v-card-text style="height: 100px; position: relative">
        <v-btn
          absolute
          dark
          fab
          top
          left
          color="blue"
        >
          <v-icon>mdi-upload</v-icon>
        </v-btn>
      </v-card-text>
    </v-content>
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
