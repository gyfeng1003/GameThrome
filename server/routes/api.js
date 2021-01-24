import {controller, post, log, required} from '../decorator/router'
import mongoose from 'mongoose'
import {randomIntro} from '../libs/exam'
import xss from 'xss'

const ExamResult = mongoose.model('ExamResult')
const User = mongoose.model('User')
@controller('/api')
export class DatabaseController {
  @post('/exam')
  @required({body: ['openid', 'profession', 'house']})
  async finishExam(ctx, next) {
    const sessionOpenid = ctx.session.openid
    const {openid, profession, house} = ctx.request.body
    if (sessionOpenid !== openid)
      ctx.throw(501, 'your openid is illegal!')

    let people = await ExamResult.findOne({openid}).exec()

    let resIntro = null
    let resImg = null

    if (people) {
      let elem = people.result.find(e=>e.profession === profession)
      if (elem) {
        resIntro = elem.intro
        resImg = elem.imgUrl
      } else {
        let result = randomIntro(profession)
        resIntro = result.intro
        resImg = result.imgUrl

        let copyP = people.result.slice()
        copyP.push({
          profession: xss(profession),
          imgUrl: resImg,
          intro: resIntro
        })
        people.result = copyP
      }
    } else {
      let result = randomIntro(profession)
      resIntro = result.intro
      resImg = result.imgUrl

      people = {
        openid: xss(openid),
        result: [
          {profession: xss(profession), imgUrl: resImg, intro: resIntro}
        ]
      }
      people = new ExamResult(people)
    }

    try {
      await people.save()
      ctx.body = {
        success: true,
        data: {
          profession,
          house,
          imgUrl: resImg,
          intro: resIntro
        }
      }
    } catch(e) {
      ctx.throw(501, e)
    }
  }
  
  @post("/login")
  @log
  @required({body: ['email', 'password']})
  async login (ctx, next) {
    const {email, password} = ctx.request.body
    try {
      let user = await User.findOne({email}).exec()
      let match = null
      if (user) {
        match = await user.comparePassword(password, user.password)
      }
      if (match) {
        let {_id, role, email, nickname, avatarUrl} = user
        ctx.session.user = {
          _id,
          role,
          email,
          nickname,
          avatarUrl
        }
        return ctx.body = {
          ret: 0,
          user: {email, nickname, avatarUrl},
          msg: 'ok'
        }
      }
      return ctx.body = {
        ret: 1,
        msg: 'USER.WRONG_PASSWORD'
      }
    }catch(e) {
      throw new Error(e)
    }
  }
}
