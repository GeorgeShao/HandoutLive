import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isTeacher: false,
    roomCode: ''
  },
  mutations: {
    SET_IS_TEACHER(state, isTeacher) {
      state.isTeacher = isTeacher;
    },
    SET_ROOM_CODE(state, roomCode) {
      state.roomCode = roomCode;
    }
  },
  actions: {
    setIsTeacher({ commit }, isTeacher) {
      commit('SET_IS_TEACHER', isTeacher);
    },
    setRoomCode({ commit }, roomCode) {
      commit('SET_ROOM_CODE', roomCode);
    }
  },
  modules: {
  }
})
