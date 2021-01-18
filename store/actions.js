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

  async focusHouse({ state }, _id) {
    if (_id === state.focusHouse._id) return
    const res = await Services.focusHouse(_id)    
    state.focusHouse = res.data
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
  },

  /**
   * 测试完成获取结果
   * @param {*} param0 
   * @param {*} obj 
   */
  finishExam({state}, obj) {
    return Services.finishExam(obj)
  }
}
