<template>
  <v-app>
    <v-card width="400" class="ma-auto">
      <v-card-title>
        <h1 class="display-1">Welcome!</h1>
      </v-card-title>
      <v-tabs
        fixed-tabs
        color="blue"
      >
        <v-tab>
          DESKTOP
        </v-tab>
        <v-tab>
          MOBILE
        </v-tab>
        <v-tab-item>
          <v-card-text>
            <v-form>
              <v-text-field label="Name" prepend-icon="mdi-face"/>
              <v-text-field label="Room Code" prepend-icon="mdi-lock"/>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="success" to="/teacher">Create</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="info">Join</v-btn>
          </v-card-actions>
        </v-tab-item>
        <v-tab-item>
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
            </v-tab-item>
            </v-tabs>
      
    </v-card>
  </v-app>
</template>

<script>
export default {
  name: 'EntryPage'
}
</script>

<style>
</style>
