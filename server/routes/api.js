import {controller, post, log, required} from '../decorator/router'
import mongoose from 'mongoose'
import {randomIntro} from '../libs/exam'
import xss from 'xss'

const ExamResult = mongoose.model('ExamResult')

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
}