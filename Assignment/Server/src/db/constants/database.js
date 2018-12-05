// Create connection to mongoose
const mongoose = require('mongoose')
const server = '127.0.0.1:27017'
const dbName = 'iot'

mongoose.connect(`mongodb://${server}/${dbName}`, (error) => {
  if (error) {
    console.log('Error ' + error)
  } else {
    console.log('Connected successfully to server')
  }
})
mongoose.Promise = global.Promise
var db = mongoose.connection

module.exports = db