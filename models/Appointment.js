var mongoose = require('mongoose');
var User = mongoose.model('User');

var AppointmentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: Number,
    status: String,
    projectType: String,
    date: String,
    time: String,
    phone: Number,
    comments: String,
    userId: String
}, {timestamps: true});


mongoose.model('Appointment', AppointmentSchema);
