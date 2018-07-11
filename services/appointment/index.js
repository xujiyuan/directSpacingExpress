var mongoose = require('mongoose');
var User = mongoose.model('User');
var Appointment = mongoose.model('Appointment');


module.exports = {

    create: async (app) => {
        let user = await User.findOne({_id: app.userId});
        if (!app.location) {
            app.location = user.address;
        }
        if (!app.phone) {
            app.phone = user.phone;
        }
        return new Appointment({
            location: app.location,
            status: app.status,
            time: app.time,
            phone: app.phone,
            comments: app.comments,
            userId: app.userId
        }).save();
    },
    get: async (query) => {
        return await Appointment.find(query);
    },
    update: async (app) => {
        return Appointment.findOneAndUpdate({_id: app._id ? app._id : app.id}, app, {returnNewDocument: true});
    },
    delete: async (app) => {
        return Appointment.deleteOne({_id: app._id ? app._id : app.id});
    }
};
