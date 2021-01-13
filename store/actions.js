import axios from 'axios'
import Services from './services'

export default {
  nuxtServerInit ({commit}, {req}) {
    if (req.session && req.session.user) {
     const {email, nickname, avatarUrl} = req.session.user
     const user = {
      email,
      nickname,
      avatarUrl
     }
     commit('SET_USER', user)
    }
  },
 
  async fetchHouses ({ state }) {
    const res = await Services.allHouses()
    state.houses = res.data

    return res
  },

  async fetchCharacters ({ state }) {
    const res = await Services.povCharacters(500)

    state.characters = res.data
    return res
  },
  
  getWechatSignature ({ commit }, url) {
    return Services.getWechatSignature(url)
  },
  
  getWechatOAuth ({ commit }, url) {
    return Services.getWechatOAuth(url)
  },

  setAuthUser ({ commit }, authUser) {
    commit('SET_AUTHUSER', authUser)
  }
}
