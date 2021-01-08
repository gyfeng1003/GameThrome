const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
import R from 'ramda'
import {resolve} from 'path'

const r = path => resolve(__dirname, path)
const MIDDLEWARE = ['database', 'general', 'router']
const app = new Koa()

const useMiddleware = (app) => {
  // 中间件的个数不定，通过 Ramda 的特性，从右往左进行函数组合，右侧函数的返回结果总是左侧函数的输入参数
  // R.map(console.log)([1, 2, 3])
  // MIDDLEWARE 数组交给了 R.map
  // 分别拿到的单个数组中的值，我们可以通过 R.compose 再次进行组合。
  return R.map(R.compose(
    R.map(i => i(app)),
    require,
    i => `${r('./middleware')}/${i}`)
  )
}

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  await nuxt.ready()
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // 添加middleware
  await useMiddleware(app)(MIDDLEWARE)

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
