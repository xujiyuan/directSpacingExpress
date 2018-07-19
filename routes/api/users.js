let mongoose = require('mongoose');
let router = require('express').Router();
let passport = require('passport');
let User = mongoose.model('User');
let auth = require('../auth');
let UserService = require('../../services/user');

router.get('/user', auth.required, async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const loginUser = await UserService.getUserUsingToken(token);
    try {
        if(loginUser.type === 'admin'){
            const query = req.query;
            let users = await UserService.get(query);
            if (users.length === 0) {
                res.status(404).json('not found');
            } else {
                res.status(200).json(users);
            }
        } else {
                res.status(200).json(loginUser);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
});

router.get('/user/validate', auth.optional, async (req, res, next) => {

    try {
        let users = await UserService.get(req.query);
        console.log(users);
        if (users.length === 0) {
            res.status(200).json({
                registered: false
            });
        } else {
            res.status(200).json({
                _id: users.user._id,
                email: users.user.email,
                registered: users.user.salt
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
});

router.put('/user', auth.optional, async (req, res) => {
    try {
        let user = await UserService.create(req.body);
        if (user) {
            res.status(201).json(user);
        } else {
            res.status(400).json(user);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
});

router.put('/user/register', auth.optional, async (req, res) => {
    try {
        let result = await UserService.register(req.body);
        res.status(201).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
});

router.post('/user/login', function (req, res, next) {
    if (!req.body.user.email) {
        return res.status(422).json({errors: {email: "can't be blank"}});
    }

    if (!req.body.user.password) {
        return res.status(422).json({errors: {password: "can't be blank"}});
    }

    passport.authenticate('local', {session: false}, function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (user) {
            user.token = user.generateJWT();
            return res.json({user: user.toAuthJSON()});
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
});

router.post('/user', async (req, res) => {
    try {
        if (req.body._id) {
            let user = await UserService.update(req.body);
            res.status(200).json(user);
        } else {
            res.status(400).json('can not update user without a given id');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
});

router.delete('/user', async (req, res) => {
    try {
        let result = await UserService.delete(req.query);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
});

module.exports = router;
