<template>
  <v-app>
    <v-card width="400" class="mx-auto mt-5">
      <v-card-title>
        <h1 class="display-1">Welcome!</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="Room Code" prepend-icon="mdi-lock"/>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="success" to="/teacher">Create</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="info">Join</v-btn>
      </v-card-actions>
    </v-card>
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
