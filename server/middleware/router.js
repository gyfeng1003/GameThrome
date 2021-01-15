import { Route } from '../decorator/router'
import { resolve } from 'path'
import Router from 'koa-router'

const r = path => resolve(__dirname, path)

export const router = app => {
  const apiPath = r('../routes')
  const router = new Route(app, apiPath)

  router.init()
}
