export default {
  state: {
    jobUpdate: false
  },
  mutations: {
    jobUpdate (state) {
      state.jobUpdate = !state.jobUpdate
    }
  },
  actions: {
    jobUpdate ({commit}) {
      commit('jobUpdate')
    }
  }
}
