let mongoose = require('mongoose')
let consSchema = new mongoose.Schema({
  _id: Number,
  records: []
},{ versionKey: false })

module.exports = mongoose.model('Consumption', consSchema)