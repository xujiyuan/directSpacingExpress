var mongoose = require('mongoose');
var router = require('express').Router();
var User = mongoose.model('User');
var Appointment = mongoose.model('Appointment');
var AppointmentService = require('../../services/appointment');
var auth = require('../auth');

router.put('/', auth.optional, function (req, res, next) {

    console.log('start creating new appoint for user' + req.body.userId);

    if(req.body.userId) {
        User.find({id:req.body.userId}).then(function(returnUser){
        }).catch(function(error){
            console.log(error);
        });

        var result = AppointmentService.create(req.body, req.body.userId);

        res.status(201).json(result);
    } else {
        res.status(400).json({
            errors: {message: 'userId is required field'}
        });
    }
});

router.get('/', auth.optional, function(req, res, next){
    Appointment.find(req.query).then(function (appt) {
        res.json(appt);
    }).catch(next);
});

module.exports = router;
