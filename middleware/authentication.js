require('dotenv').config()
const jwt = require("jsonwebtoken")
const {UnauthenticatedError} = require('../errors')

const authMiddleware = async (req, res, next) => {
const authHeader = req.headers.authorization
if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid')
}
const token = authHeader.split(' ')[1]
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const {id, name} = decoded

    req.user = {id, username: name}
    next()
} catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
}
}

module.exports = authMiddleware
