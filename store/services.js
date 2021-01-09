import axios from 'axios'
const baseUrl = ''

class Services {
 /**
  * 查询所有家族
  * @return {Promise}
  */
 allHouses () {
   return axios.get(`${baseUrl}/wiki/houses`)
 }

 /**
  * 查询主要人物
  * @param {limit} name
  * @return {Promise}
  */
  povCharacters (limit = 20) {
    return axios.get(`${baseUrl}/wiki/characters?limit=${limit}`)
  }
}

export default new Services()

