const express = require('express')
const router = express.Router()
const mqtt = require("mqtt");

router.post('/', (req, res) => {
    let client = mqtt.connect("tcp://192.168.0.111:1883");
    
    let socketId = req.body.id
    client.on("connect", function() {
        client.publish("IoT/Relay", "Toggle");
    });

    res.status(200).json({status: 'ok'})
})

module.exports = router