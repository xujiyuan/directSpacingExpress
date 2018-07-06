let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let secret = require('../config').secret;

let UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true, match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
    email: {type: String, lowercase: true, unique: true, match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    name: String,
    address: String,
    phone: Number,
    comments: String,
    userType: String,
    status: String,
    hash: String,
    salt: String,
    bio: String,
    image: String
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.methods.validPassword = function (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.setPassword = async function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function () {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

UserSchema.methods.toAuthJSON = function () {
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT(),
        bio: this.bio,
        image: this.image
    };
};

UserSchema.methods.toProfileJSONFor = function (user) {
    return {
        username: this.username,
        bio: this.bio,
        image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'
    };
};

// UserSchema.methods.favorite = function (id) {
//     if (this.favorites.indexOf(id) === -1) {
//         this.favorites.push(id);
//     }
//
//     return this.save();
// };

// UserSchema.methods.unfavorite = function (id) {
//     this.favorites.remove(id);
//     return this.save();
// };
//
// UserSchema.methods.isFavorite = function (id) {
//     return this.favorites.some(function (favoriteId) {
//         return favoriteId.toString() === id.toString();
//     });
// };
//
// UserSchema.methods.follow = function (id) {
//     if (this.following.indexOf(id) === -1) {
//         this.following.push(id);
//     }
//
//     return this.save();
// };
//
// UserSchema.methods.unfollow = function (id) {
//     this.following.remove(id);
//     return this.save();
// };
//
// UserSchema.methods.isFollowing = function (id) {
//     return this.following.some(function (followId) {
//         return followId.toString() === id.toString();
//     });
// };

mongoose.model('User', UserSchema);
