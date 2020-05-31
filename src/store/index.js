import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const getDefaultState = () => ({
  isTeacher: false,
  userName: '',
  roomCode: '',
  students: [],
  // teachers only
  currentStudentId: '',
});

export default new Vuex.Store({
  state: getDefaultState(),
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
    },
    REMOVE_STUDENT(state, studentId) {
      state.students = state.students.filter(id => id !== studentId);
    },
    ADD_STUDENT_LINES(state, { studentId, lines }) {
      const student = state.students.find(({ id }) => id === studentId);
      if (!student) return;
      student.lines = student.lines.concat(lines);
    },
    SET_USER_NAME(state, name) {
      state.userName = name;
    },
    RESET_STATE(state) {
      Object.assign(state, getDefaultState());
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
    addStudent({ commit }, student) {
      commit('ADD_STUDENT', { ...student, lines: [] });
    },
    removeStudent({ commit }, studentId) {
      commit('REMOVE_STUDENT', studentId);
    },
    addStudentLines({ commit }, { studentId, lines }) {
      commit('ADD_STUDENT_LINES', { studentId, lines });
    },
    setUserName({ commit }, name) {
      commit('SET_USER_NAME', name);
    },
    resetState({ commit }) {
      commit('RESET_STATE');
    }
  },
  getters: {
    getLinesByStudentId: (state) => (studentId) => {
      const student = state.students.find(({ id }) => studentId === id);
      if (!student) console.error(`Student ${studentId} not found.`);
      return student.lines;
    }
  }
})
