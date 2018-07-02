var mongoose = require('mongoose');
var User = mongoose.model('User');
var Appointment = mongoose.model('Appointment');


module.exports = {

    create : function(app, returnUser){

            if(!app.location){
                app.location = returnUser.address;
            }
            if(!app.phone) {
                app.phone = returnUser.phone;
            }
            return new Appointment({
                location: app.location,
                status: app.status,
                time: app.time,
                phone: app.phone,
                comments: app.comments,
                userId: app.userId? app.userId : returnUser.id
            }).save().then(function(result){
                return result;
            });
    }

};
