let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let secret = require('../config').secret;

let UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, index: true},
    email: {type: String, lowercase: true, unique: true, match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    firstName: String,
    lastName: String,
    address1: String,
    address2: String,
    phone: Number,
    comments: String,
    type: String,
    status: String,
    hash: String,
    salt: String,
    bio: String,
    image: String
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.methods.validPassword = function (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt.toString(), 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.setPassword = async function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function () {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate());

    return jwt.sign({
        id: this._id,
        username: this.username,
        email: this.email,
        exp: parseInt(exp.getTime() + 1000 / 1000),
    }, secret);
};

UserSchema.methods.toAuthJSON = function () {
    return {
        username: this.firstName + this.lastName,
        email: this.email,
        token: this.generateJWT(),
        bio: this.bio,
        image: this.image
    };
};

UserSchema.methods.getEmailFromToken = function(token) {
    let result = jwt.verify(token,secret);
    return result;
};

UserSchema.methods.toProfileJSONFor = function (user) {
    return {
        username: this.firstName + this.lastName,
        bio: this.bio,
        image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'
    };
};

mongoose.model('User', UserSchema);
