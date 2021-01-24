import {controller, get, log} from '../decorator/router'

@controller('/login')
export class LoginController {
 
 @get('ercode')
 @log
 async getErcode(ctx, next) {
  ctx.body = {
   status: 0,
   data: await account.getErcode()
  }
 }
}