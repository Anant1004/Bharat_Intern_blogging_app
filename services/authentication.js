const JWT = require('jsonwebtoken');

const secret = process.env.SECRET_TOKEN;

function createTokenforUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
        fullName : user.fullName,
    }
    const token = JWT.sign(payload, secret)
    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenforUser,
    validateToken,
}