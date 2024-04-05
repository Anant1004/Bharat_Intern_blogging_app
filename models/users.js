const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const { createTokenforUser } = require('../services/authentication');


const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    profileImageURL: {
        type: String,
        default: '/images/avatar.png',
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    }
}, { timestamps: true });

userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User Not Found');

    const salt = user.salt;
    const hasedPassword = user.password;
    const userProvidedHash = createHmac('sha256', salt).update(password).digest('hex');

    if (hasedPassword !== userProvidedHash) throw new Error('Incorrect password')
    const token = createTokenforUser(user);
    return token;
});



userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return;

    const salt = randomBytes(16).toString();
    const hasedPassword = createHmac('sha256', salt).update(user.password).digest('hex');
    this.salt = salt;
    this.password = hasedPassword;
    next();
});

const User = model('user', userSchema);
module.exports = User;