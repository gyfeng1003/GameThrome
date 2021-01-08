import fs from 'fs'
import mongoose from 'mongoose'
import { resolve } from 'path'
import _ from 'lodash'
import config from '../config'
import R from 'ramda'

const models = resolve(__dirname, '../database/schema')

fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(resolve(models, file)))

const formatWikiCharacters = R.map(i => {
  i._id = i.nmId
  return i
})

// 安装 mongoose
// resolve
// err = error
// ../config
// , save token

var characters = require('database/json/allCharacters.json')
var houses = require('database/json/allHouses.json')
var wikiCharacters = require('database/json/wikiCharacters.json')
var wikiHouses = require('database/json/wikiHouses.json')

wikiCharacters = formatWikiCharacters(wikiCharacters)

export const database = app => {
  console.log('database-------------');
  
  if (config.env === 'development') {
    mongoose.set('debug', true)
  }

  // 连接数据库
  mongoose.Promise = global.Promise; 
  mongoose.connect(config.db, {
    useMongoClient: true
  })
  // 断开重连
  mongoose.connection.on('disconnected', () => {
    mongoose.Promise = global.Promise
    mongoose.connect(config.db, {
      useMongoClient: true
    })
  })
  // 连接监听到错误
  mongoose.connection.on('error', err => {
    console.error(err)
  })
  // 连接打开
  mongoose.connection.once('open', async () => {
    console.log('Connected to MongoDB', config.db)

    const Character = mongoose.model('Character')
    const WikiCharacter = mongoose.model('WikiCharacter')
    const WikiHouse = mongoose.model('WikiHouse')
    const User = mongoose.model('User')

    // 说明第一次初始化插入数据已经完成

    characters = _.map(characters, formatData)
    houses = _.map(houses, formatData)

    let existCharacter = await Character.find({}).exec()
    if (!existCharacter.length) Character.insertMany(characters)

    let existWikiCharacter = await WikiCharacter.find({}).exec()
    if (!existWikiCharacter.length) WikiCharacter.insertMany(wikiCharacters)

    let existwikiHouses = await WikiHouse.find({}).exec()
    if (!existwikiHouses.length) WikiHouse.insertMany(wikiHouses)

    let user = await User.findOne({email: 'gyfeng1003@126.com'}).exec()
    if (!user) new User({email: 'gyfeng1003@126.com', password: '123456', role: 'admin'}).save()
  })
}

const formatData = (item, index) => {
  item._id = item.url

  _.forIn(item, (value, key) => {
    if (!value || !value.length) delete item[key]
  })

  return item
}
