let mongoose = require('mongoose');
let User = mongoose.model('User');
let Appointment = mongoose.model('Appointment');

module.exports = {

    create: async (payload) => {
        let user = await User.findOne({email: payload.email});
        if (user) {
            return new Promise((resolve) => {
                resolve(user);
            });
        }
        else {
            return new User({
                username: payload.username,
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName,
                address1: payload.address1,
                address2: payload.address2,
                comments: payload.comments,
                zip: payload.zip,
                state: payload.state,
                phone: payload.phone,
                type: payload.type,
                status: payload.status,
                bio: payload.bio,
                image: payload.image
            }).save();
        }
    },
    get: async (query) => {
        let users = await User.find(query);
        if (users.length === 1) {
            let appointments = await Appointment.find({userId: users[0]._id});
            return new Promise((resolve) => {
                resolve({
                    user: users[0],
                    appointments: appointments
                })
            })
        } else {
            return users;
        }
    },
    update: async (user) => {
        return User.findOneAndUpdate({_id: user._id}, user, {returnNewDocument: true});
    },
    delete: async (query) => {
        return User.deleteOne(query);
    },
    register: async (user) => {
        let userModel = await User.findOne({_id: user._id});
        userModel.setPassword(user.password);
        return User.findOneAndUpdate({_id: userModel._id}, userModel, {returnNewDocument: true});
    },
    validate: async (user) => {
        let userModel = await User.findOne({_id: user._id});
        userModel.validPassword(user.password);
        return new Promise(resolve => {
            resolve(userModel.generateJWT());
        })
    },
    getUserUsingToken: async (token) => {
        let userModel = new User();
        const user = await User.findOne({email: userModel.getEmailFromToken(token).email});
        if (user) {
            let appointments = await Appointment.find({userId: user._id});
            return new Promise((resolve) => {
                resolve({
                    user: user,
                    appointments: appointments
                })
            })
        } else {
            return user;
        }
    }
};
