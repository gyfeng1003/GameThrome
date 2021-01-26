const mongoose = require('mongoose')
const {Schema} = mongoose

const CodeSchema = new Schema({
 code: {
  type: String
 },
 sessionKey: String
})

mongoose.model('Code', CodeSchema)