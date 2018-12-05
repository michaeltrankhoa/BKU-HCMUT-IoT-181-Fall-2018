const UserSchema = require('../models/user')
const db = require('../constants/database')

let userManager = {

    createUser: (newUser) => {
        let user = new UserSchema(newUser)
        return user.save()
    },

    removeUser: (userId) => {
        return UserSchema.deleteOne(
            {
                _id: userId
            })

    },

    updateKeys: (userId, newPbKey, newPvKey) => {
        return UserSchema.findOne(
            {
                _id: userId
            })
            .then(permission => {
                if (permission != null) {
                    permission.pbkey = newPbKey
                    permission.pvkey = newPvKey
                    return permission.save()
                } else {
                    return null
                }
            })
    },

    getUser: (userId) => {
        return UserSchema.findOne(
            {
                _id: userId
            })
    },

    login: (id, pvkey) => {
        return UserSchema.findOne({_id: id, pvkey: pvkey}, function (err, user) {
            return user;
        });
    }
}

module.exports = userManager