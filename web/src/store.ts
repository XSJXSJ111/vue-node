import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

interface State {
  btnLoad:boolean
}

const state: State = {
  btnLoad:false
}

export default new Vuex.Store({
  state,
  
  mutations: {
    setBtnLoad(state, data:boolean = false) {
      state.btnLoad = data
    }
  },
  actions: {

  }
})
