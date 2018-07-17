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
            firstName: app.firstName,
            lastName: app.lastName,
            email: app.email,
            address1: app.address1,
            address2: app.address2,
            city: app.city,
            state: app.state,
            zip: app.zip,
            status: app.status,
            projectType: app.projectType,
            date: app.date,
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
