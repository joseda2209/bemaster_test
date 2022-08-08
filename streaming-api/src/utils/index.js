const { logger } = require('./logger')
const { validate } = require('./validation.middleware')
const { verifyToken } = require('./token.middleware')
const {verifyAdminstrator} = require('./rol.middleware')

module.exports = {
    logger,
    validate,
    verifyToken,
    verifyAdminstrator
  }