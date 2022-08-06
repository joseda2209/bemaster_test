const express = require('express')

const { validate } = require('../../../utils')
const controller = require('./auth.controller')
const validations = require('./auth.validations')

const router = express.Router({
    strict: true
  })

router.post('/login',validate(validations.login), controller.login)
router.post('/logout', controller.logout);

module.exports = { router }