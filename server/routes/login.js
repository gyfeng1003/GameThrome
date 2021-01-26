import {controller, get, log} from '../decorator/router'
const account = require('../controller/account')
@controller('/login')
export class LoginController {
  /**
   * 获取二维码
   */
  @get("/ercode")
  @log
  async qrcode (ctx, next) {
    let ercode = await account.getErcode()
    return ctx.body = {
      ret: 0,
      result: ercode
    }
  }

  /**
   * 轮询检查登录状态
   * @param {}} ctx 
   * @param {*} next 
   */
  @get('/errcode/check/:code')
  @log
  async getToken (ctx, next) {
    const startTime = Date.now()
    async function login() {
      const code = ctx.params.code
      const sessionKey = await account.getSessionKeyByCode(code)
      if (sessionKey) {
        ctx.body = {
          status: 0,
          data: {
            sessionKey: sessionKey
          }
        }
      } else {
        if (Date.now() - startTime < 10000) {
          await new Promise((resolve) => {
            process.nextTick(() => {
              resolve()
            })
          })
          await login()
        } else {
          ctx.body = {
            status: -1
          }
        }
      }
    }
    await login()
  }

  /**
   * 扫码登陆中，小程序侧调用的接口。将扫到的二维码信息传递过来
   */
  @get('/ercode/:code')
  @log
  async setSessionForCode(ctx, next) {
    const code = ctx.params.code
    const sessionKey = ctx.get('x-session')
    await account.setSessionKeyForCode(code, sessionKey)
    ctx.body = {
      status: 0
    }
  }
}
