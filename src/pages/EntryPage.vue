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
            <span class="mx-auto" id="invalid_room_code_msg" style="color: red; display: none">Invalid room code!</span>
            <v-spacer></v-spacer>
            <v-btn color="info" @click="joinRoom()">Join</v-btn>
          </v-card-actions>
        </v-tab-item>
        <v-tab-item>
          <v-card-text>
            <v-form>
              <v-text-field label="Connect Code" prepend-icon="mdi-lock" v-model="connectCode" />
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="info" @click="connectDevice()">Connect</v-btn>
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
    roomCode: '',
    connectCode: ''
  }),
  methods: {
    joinRoom() {
      this.$socket.emit('joinRoom', {
        roomCode: this.roomCode,
        userName: this.userName
      }, (result) => {
        if (!result.success){
          var invalid_room_code_msg_box = document.getElementById("invalid_room_code_msg");
          invalid_room_code_msg_box.style.display = "block";
          return console.error(result.message);
        }
        this.setUserName(this.userName);
        this.setRoomCode(this.roomCode);
        this.setIsTeacher(false);
        this.setUserId(this.$socket.id);
        this.setConnectCode(result.connectCode);
        this.addStudent({
          id: result.teacherId,
          name: result.teacherName
        });
        this.addStudent({
          id: this.$socket.id,
          name: this.userName
        });
        this.setCurrentStudentId(this.$socket.id);
        this.$router.push({ path: '/room' });
      });
    },
    createRoom() {
      this.$socket.emit('createRoom', {
        roomCode: this.roomCode,
        userName: this.userName
      }, (result) => {
        if (!result.success) return console.error(result.message);
        this.setUserName(this.userName);
        this.setRoomCode(this.roomCode);
        this.setIsTeacher(true);
        this.setUserId(this.$socket.id);
        this.addStudent({
          id: this.$socket.id,
          name: this.userName
        });
        this.setCurrentStudentId(this.$socket.id);
        this.setConnectCode(result.connectCode);
        this.$router.push({ path: '/room'});
      })
    },
    connectDevice() {
      this.$socket.emit('connectDevice', this.connectCode, (result) => {
        if (!result.success) return console.error(result.message);
        this.setRoomCode(this.roomCode);
        this.setIsTeacher(result.isTeacher);
        this.setUserId(result.userId);
        this.setCurrentStudentId(result.userId);
        this.setConnectCode(result.connectCode);
        this.$router.push({ path: '/mobile' });
      });
    },
    ...mapActions([
      'setRoomCode',
      'setIsTeacher',
      'setUserName',
      'addStudent',
      'setCurrentStudentId',
      'setConnectCode',
      'setUserId'
    ])
  }
}
</script>

<style>
</style>
