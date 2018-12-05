const ConsSchema = require('../models/consumption')
const db = require('../constants/database')

let consManager = {

    createUserConsumption: (newUserCons) => {
        let userCons = new ConsSchema(newUserCons)
        return userCons.save()
    },

    getUserConsumption: (socketId) => {
        return ConsSchema.findOne(
            {
                _id: socketId
            }, function (err, socket) {
                if (socket == null)
                    return false

                return socket.save()
            })
    },

    getConsumptionDay: (socketId, day) => {
        return ConsSchema.findOne(
            {
                _id: socketId
            }).then(socket => {
                if (socket == null)
                    return false

                let records = socket.records
                records = records.sort((a, b) => b.date - a.date)
                let startElement = records.find(x => x.date == day)
                let startIndex = records.indexOf(startElement)
                return records.slice(startIndex, startIndex + 7)
            })
    },

    getConsumptionMonth: (socketId, month) => {
        return ConsSchema.findOne(
            {
                _id: socketId
            }).then(socket => {
                if (socket == null)
                    return false

                let records = socket.records
                let monthCons = {
                    month: month,
                    totalConsumption: 0,
                    records: []
                }

                monthCons.records = records.filter(x => {
                    return x.date.substring(0, 6) == month
                })

                for (let i = 0; i < monthCons.records.length; i++) {
                    monthCons.totalConsumption += monthCons.records[i].consumption
                }
                return monthCons
            })
    },

    getConsumptionYear: (socketId, year) => {
        return ConsSchema.findOne(
            {
                _id: socketId
            }).then(socket => {
                if (socket == null)
                    return false

                let records = socket.records
                let yearCons = {
                    year: year,
                    totalConsumption: 0,
                    records: []
                }

                let temp = records.filter(x => {
                    return x.date.substring(0, 4) == year
                })

                for (let j = 1; j <= 12; j++) {
                    yearCons.records.push({
                        month: j,
                        totalConsumption: 0
                    })
                }
                for (let i = 0; i < temp.length; i++) {
                    let month = temp[i].date.substring(4, 6)
                    // yearCons.records[month - 1].records.push(temp[i])
                    yearCons.records[month - 1].totalConsumption += temp[i].consumption
                }

                for (let j = 0; j <= 11; j++) {
                    yearCons.totalConsumption += yearCons.records[j].totalConsumption
                }
                return yearCons
            })
    },

    /**
     * Update consumptions in sockets
     * @param date - date for updating
     * @param sockets - list of sockets and theirs consumptions
     */
    updateConsInDay: (socketId, date, cons) => {
        return ConsSchema.findOne({ _id: socketId }).then(socket => {
            let dailyRecord = socket.records.find(r => r.date == date)

            if (dailyRecord != undefined) {
                let index = socket.records.indexOf(dailyRecord)
                socket.records[index].consumption += parseFloat(cons)
                console.log(socket.records[index].consumption)
            } else {
                let newDayRecord = {
                    date: date,
                    consumption: cons
                }
                socket.records.push(newDayRecord)
            }

            newSocket = new ConsSchema(socket)
            return newSocket.save()

            // let userCons = new ConsSchema(dateCons)
            // userCons.save()
            // return true
        }).catch(e => {
            console.log("k tim thay")
            return false
        })
    },

    /**
     * Check if data of a date exists in collections or not
     */
    isExist: (date) => {
        return ConsSchema.countDocuments({ _id: date }, function (err, count) {
            return count > 0;
        });
    }
}

module.exports = consManager