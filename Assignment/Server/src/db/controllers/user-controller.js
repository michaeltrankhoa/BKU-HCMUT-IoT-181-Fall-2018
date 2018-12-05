const express = require('express')
const router = express.Router()
const manager = require('../services/user-service')

router.post('/', (req, res) => {
    let user = JSON.parse(JSON.stringify(req.body))
    manager.createUser(user)
    .then(p => {
        if (p != null)
            res.status(200).json({success: "added user " + user._id})   
        else
            res.status(400).json({error: "userId " + user._id + " is already exist"})
    }, err => {
        res.status(400).json({error: "userId " + user._id + " is already exist"})
    })
})

router.delete('/', (req, res) => {
    let userId = req.body.userId
    manager.removeUser(userId)
    
    .then(result => {
        
        if (result.n == 0)
            res.status(400).json({error: "userId is not found!"})
        else
            res.status(200).json({success: "Deleted user with id: " + userId})
    })
})

router.put('/', (req, res) => {
    let userId = req.body.userId
    let pvkey = req.body.pvkey
    let pbkey = req.body.pbkey
    manager.updateKeys(userId,pbkey,pvkey)
    .then(result => {
        if (result != null)
            res.status(200).json({success: "updated user " + userId})
        else
            res.status(400).json({result: "userId is not found!"})
    }
    )
   
})

router.get('/:id', (req, res) => {
    let _id = req.params.id;
    manager.getUser(_id).then(user =>
        
        res.status(200).json(user)
    )
})

router.post('/login', (req, res) => {
    let _id = req.body._id;
    let pvkey = req.body.pvkey;
    manager.login(_id, pvkey).then(user => {
        if (user != null)
            res.status(200).json({address: user.address, phone: user._id, sockets: user.sockets, member: user.member})
        else
            res.status(200).send(false)
    })
})

module.exports = router