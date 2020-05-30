import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isStudentSidebarVisible: false
  },
  mutations: {
    TOGGLE_STUDENT_SIDEBAR(state, isVisible) {
      state.isStudentSidebarVisible = isVisible;
    }
  },
  actions: {
    toggleStudentSidebar({ commit }, isVisible) {
      commit('TOGGLE_STUDENT_SIDEBAR', isVisible);
    }
  },
  modules: {
  }
})
