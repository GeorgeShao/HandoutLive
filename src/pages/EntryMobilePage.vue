<template>
  <v-app>
    <v-card width="400" class="ma-auto">
      <v-card-title>
        <h1 class="display-1">Welcome!</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="Secret Key" prepend-icon="mdi-lock"/>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="info">Join</v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<script>
export default {
  name: 'EntryMobilePage'
}
</script>

<style>
</style>
