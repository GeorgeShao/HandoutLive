<template>
  <v-navigation-drawer
    app
    :value="isVisible"
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
</template>

<script>
export default {
  name: 'TheAppBar',
  props: {
    isVisible: {
      type: Boolean
    }
  }
}
</script>
