let mongoose = require('mongoose');
let router = require('express').Router();
let User = mongoose.model('User');
let Appointment = mongoose.model('Appointment');
let AppointmentService = require('../../services/appointment');
let auth = require('../auth');

router.put('/', auth.optional, async function (req, res) {

    console.log('start creating new appoint for user' + req.body.userId);

    if (req.body.userId) {
        try {
            let result = await AppointmentService.create(req.body);
            res.status(201).json(result);
        } catch (err) {
            console.log(err);
            res.status(500).json(err.message);
        }
    } else {
        res.status(400).json({
            errors: {message: 'userId is required field'}
        });
    }
});

router.delete('/', auth.required, async (req, res) =>{
    if (req.query) {
        try {
            let result = await AppointmentService.delete(req.query);
            res.status(200).json(result);
        } catch (err) {
            console.log(err);
            res.status(500).json(err.message);
        }
    } else {
        res.status(400).json({
            errors: {message: 'id or _id is required field'}
        });
    }
});

router.post('/', auth.required, async (req, res) => {
    if (req.body.id || req.body._id) {
        try {
            let result = await AppointmentService.update(req.body);
            result = await AppointmentService.get({_id: result._id});
            res.status(200).json(result);
        } catch (err) {
            console.log(err);
            res.status(500).json(err.message);
        }
    } else {
        res.status(400).json({
            errors: {message: 'id or _id is required field'}
        });
    }
});

router.get('/', auth.optional, async function (req, res) {
    try {
        let result = await AppointmentService.get(req.query);
        if (result.length === 1) {
            let user = await User.find({_id: result[0].userId});
            res.status(200).json({
                appointment: result[0],
                user: user[0]
            })
        }
        else if (result.length === 0) {
            res.status(404).json('not found');
        }
        else {
            res.status(200).json(result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }

});

module.exports = router;
