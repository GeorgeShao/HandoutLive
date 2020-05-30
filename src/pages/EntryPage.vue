<template>
  <v-app>
    <v-card width="400" class="ma-auto">
      <v-card-title>
        <h1 class="display-1">Welcome!</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            label="Room Code"
            prepend-icon="mdi-lock"
            v-model="roomCode"
          />
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="success" @click="createRoom()">Create</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="info" @click="joinRoom()">Join</v-btn>
      </v-card-actions>
    </v-card>
    <v-btn color="info" to="/entrymobilepage">Connect Phone</v-btn>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'EntryPage',
  data: () => ({
    roomCode: ''
  }),
  methods: {
    joinRoom() {
      this.$socket.emit('joinRoom', this.roomCode, (result) => {
        // TODO DISPLAY ERROR MESSAGES IN THE FORM
        if (!result.success) return console.log(result.message);
        this.setRoomCode(this.roomCode);
        this.setIsTeacher(false);
        this.$router.push({ path: '/user' });
      });
    },
    createRoom() {
      this.$socket.emit('createRoom', this.roomCode, (result) => {
        if (!result.success) return console.log(result.message);
        this.setRoomCode(this.roomCode);
        this.setIsTeacher(true);
        this.$router.push({ path: '/teacher'});
      })
    },
    ...mapActions(['setRoomCode'])
  }
}
</script>

<style>
</style>
