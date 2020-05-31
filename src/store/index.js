import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isTeacher: false,
    roomCode: '',
    currentStudentId: '',
    students: []
  },
  mutations: {
    SET_IS_TEACHER(state, isTeacher) {
      state.isTeacher = isTeacher;
    },
    SET_ROOM_CODE(state, roomCode) {
      state.roomCode = roomCode;
    },
    SET_CURRENT_STUDENT_ID(state, currentStudentId) {
      state.currentStudentId = currentStudentId;
    },
    ADD_STUDENT(state, student) {
      state.students.push(student);
    }
  },
  actions: {
    setIsTeacher({ commit }, isTeacher) {
      commit('SET_IS_TEACHER', isTeacher);
    },
    setRoomCode({ commit }, roomCode) {
      commit('SET_ROOM_CODE', roomCode);
    },
    setCurrentStudentId({ commit }, currentStudentId) {
      commit('SET_CURRENT_STUDENT_ID', currentStudentId);
    },
    addStudent({ commit }, studentId) {
      commit('ADD_STUDENT', { id: studentId, lines: [] });
    }
  },
  modules: {
  }
})
