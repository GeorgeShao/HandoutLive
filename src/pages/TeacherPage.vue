<template>
  <v-app>
    <TheAppBar />
    <TheStudentDrawer />
    <v-content>
      <DrawingCanvas />
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
    </v-content>
  </v-app>
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
</template>
<script>
  import TheStudentDrawer from "../components/TheStudentsSidebar";
  import DrawingCanvas from '../components/DrawingCanvas';
  import TheAppBar from "../components/TheAppBar";

  export default {
    name: 'TeacherPage',
    components: {TheAppBar, DrawingCanvas, TheStudentDrawer },
    data: () => ({
      studentDrawer: true,
      messageDrawer: false
    })
  }
</script>

<style>
  .v-content {
    display: flex;
    flex-direction: row;
  }

  .canvas {
    flex-grow: 1;
  }
</style>
