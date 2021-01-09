import {controller, get, log} from '../decorator/router'
import mongoose from 'mongoose'

const WikiCharacter = mongoose.model('WikiCharacter')
const WikiHouse = mongoose.model('WikiHouse')

@controller('/wiki')
export class WikiController {
 
  @get('/characters')
  @log
  async getCharacters (ctx, next) {
    let { limit = 20 } = ctx.query
    let characters = await WikiCharacter
      .find({})
      .limit(Number(limit))
      .exec()

    ctx.body = characters
  }
 
  @get('/houses')
  @log
  async getHouses (ctx, next) {
    let houses = await WikiHouse
    .find({})
    .populate({
     path: 'swornMembers.character',
     select: '_id name cname profile'
    })
    .exec()
    
    ctx.body = houses
  }
}
