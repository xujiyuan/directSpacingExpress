var mongoose = require('mongoose');
var User = mongoose.model('User');

var AppointmentSchema = new mongoose.Schema({
    location: String,
    status: String,
    time: Date,
    phone: Number,
    comments: String,
    userId: String
}, {timestamps: true});


mongoose.model('Appointment', AppointmentSchema);
