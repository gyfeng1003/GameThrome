const { required }=require("../../decorator/router");

const mongoose = require('mongoose')
const {Schema} = mongoose

const CodeSchema = new Schema({
 code: {
  type: String
 },
 sessionKey: String
})

mongoose.model('code', CodeSchema)