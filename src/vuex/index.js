import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import cards from './modules/cards'
import job from './modules/job'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    cards,
    job
  }
})
