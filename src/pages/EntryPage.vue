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
              <v-text-field label="Name" prepend-icon="mdi-face" v-model="userName" />
              <v-text-field label="Room Code" prepend-icon="mdi-lock" v-model="roomCode"/>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="success" @click="createRoom()">Create</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="info" @click="joinRoom()">Join</v-btn>
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
            <v-btn color="info">Connect</v-btn>
          </v-card-actions>
            </v-tab-item>
            </v-tabs>
    </v-card>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'EntryPage',
  data: () => ({
    userName: '',
    roomCode: ''
  }),
  methods: {
    joinRoom() {
      this.$socket.emit('joinRoom', {
        roomCode: this.roomCode,
        userName: this.userName
      }, (result) => {
        // TODO DISPLAY ERROR MESSAGES IN THE FORM
        if (!result.success) return console.log(result.message);
        this.setRoomCode(this.roomCode);
        this.setIsTeacher(false);
        this.$router.push({ path: '/room' });
      });
    },
    createRoom() {
      this.$socket.emit('createRoom', {
        roomCode: this.roomCode,
        userName: this.userName
      }, (result) => {
        if (!result.success) return console.log(result.message);
        this.setRoomCode(this.roomCode);
        this.setIsTeacher(true);
        this.$router.push({ path: '/room'});
      })
    },
    ...mapActions(['setRoomCode', 'setIsTeacher'])
  }
}
</script>

<style>
</style>
