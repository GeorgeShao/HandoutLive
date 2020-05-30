<template>
  <div>
    <v-card height="100vh">
      <v-navigation-drawer
        absolute
        permanent
        right
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
      <DrawingCanvas />
    </v-card>
  </div>
</template>

<script>
import DrawingCanvas from '../components/DrawingCanvas';

export default {
  name: 'TeacherPage',
  components: { DrawingCanvas }
}
</script>

<style>
</style>
