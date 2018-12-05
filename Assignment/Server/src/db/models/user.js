let mongoose = require('mongoose')
let userSchema = new mongoose.Schema({
  _id: Number,
  pvkey: String,
  address: String,
  member : String,
  sockets: Number
},{ versionKey: false })

module.exports = mongoose.model('User', userSchema)