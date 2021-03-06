import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import {getters} from './getters'

const createStore = () => {
 return new Vuex.Store({
  state: {
   houses: [],
   characters: [],
   authUser: null,
   user: null,
   focusHouse: {}
  },
  getters,
  actions,
  mutations
 })
}

export default createStore