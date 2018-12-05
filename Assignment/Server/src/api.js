const express = require('express');
const bodyParser = require('body-parser')
const userRouter = require('./db/controllers/user-controller')
const consRouter = require('./db/controllers/cons-controller')
const mqttRouter = require('./db/controllers/mqtt-controller')
const app = express();
const PORT = process.env.PORT || 5533;
const mqtt = require("mqtt");
const consService = require('./db/services/cons-service')

app.use(bodyParser.json())
app.use('/users', userRouter)
app.use('/sockets', consRouter)
app.use('/mqtts', mqttRouter)
app.listen(PORT, () => console.log(`Listening on ${PORT} ..`));

app.get('/', (req, res) => {
    res.send(`Listening on ${PORT}`);
})

let client = mqtt.connect("tcp://192.168.0.111:1883")

client.subscribe("IoT/KWH", function (err) {
    if (!err)
        console.log('subscribing..')
})

let today = getTodayString()

client.on('message', function (topic, message) {
    // message is Buffer
    let msg = message.toString().split('-')
    let cons = parseFloat(msg[0])
    
    console.log(msg)
    console.log(cons)
    let socketId = parseInt(msg[1])
    if (today != getTodayString()) {
        today = getTodayString()
    }
    consService.updateConsInDay(socketId, today, cons)
})

function getTodayString() {
    let date = new Date();
    let day = leftPad(date.getDate(), 2);
    let month = leftPad(date.getMonth(), 2);
    let year = leftPad(date.getFullYear(), 4);
    return year + month + day
}

function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}
