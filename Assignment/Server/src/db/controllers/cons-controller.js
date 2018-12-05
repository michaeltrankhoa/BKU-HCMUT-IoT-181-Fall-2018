const express = require('express')
const router = express.Router()
const manager = require('../services/cons-service')

router.post('/', (req, res) => {
    let userCons = JSON.parse(JSON.stringify(req.body))

    manager.isExist(userCons._id)
        .then(result => {
            if (result) {
                let r = res.status(200).json(manager.updateConsInDay(userCons._id, '20180831', 0.345))
                // if (r)
                //     res.status(200).json({ success: "updated date " + userCons._id })
                // else
                //     res.status(200).json({ error: 'something wrong' })
            } else {
                manager.createUserConsumption(userCons)
                    .then(p => {
                        if (p != null)
                            res.status(200).json({ success: "added consumption of user " + userCons._id })
                        else
                            res.status(400).json({ error: "consumption of user " + userCons._id + " is already exist" })
                    }, err => {
                        res.status(400).json({ error: "consumption of user " + userCons._id + " is already exist" })
                    })
            }
        })

})

router.delete('/', (req, res) => {
    let userId = req.body.userId
    manager.removeUser(userId)

        .then(result => {

            if (result.n == 0)
                res.status(400).json({ error: "userId is not found!" })
            else
                res.status(200).json({ success: "Deleted user with id: " + userId })
        })
})

router.put('/', (req, res) => {
    let userId = req.body.userId
    let pvkey = req.body.pvkey
    let pbkey = req.body.pbkey
    manager.updateKeys(userId, pbkey, pvkey)
        .then(result => {
            if (result != null)
                res.status(200).json({ success: "updated user " + userId })
            else
                res.status(400).json({ result: "userId is not found!" })
        })
})

// router.get('/:id', (req, res) => {
//     let _id = req.params.id;
//     manager.getUserConsumption(_id).then(userCons =>
//         res.status(200).json(userCons)
//     )
// })

router.get('/:id%:day%:month%:year', (req, res) => {
    // res.json(req.params)
    let _id = req.params.id;
    let day = leftPad(req.params.day, 2)
    let month = leftPad(req.params.month, 2)
    let year = leftPad(req.params.year, 4)

    if (year != '0000') {
        if (month != '00') {
            if (day != '00') {
                manager.getConsumptionDay(_id, year + month + day).then(userCons => {
                    if (res == false)
                        res.status(200).json({ fail: "Socket id is not found" })
                    else
                        res.status(200).json(userCons)
                })
            } else {
                manager.getConsumptionMonth(_id, year + month).then(userCons => {
                    if (res == false)
                        res.status(200).json({ fail: "Socket id is not found" })
                    else
                        res.status(200).json(userCons)
                })
            }
        } else {
            manager.getConsumptionYear(_id, year).then(userCons => {
                if (res == false)
                    res.status(200).json({ fail: "Socket id is not found" })
                else
                    res.status(200).json(userCons)
            })
        }
    } else {
        res.status(200).json({fail: "Date is not valid"})
    }
})

function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}

module.exports = router