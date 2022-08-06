const express = require('express')

const { validate, verifyToken } = require('./../../../utils')

const controller = require('./user.controller')
const validations = require('./user.validations')

const router = express.Router({
    strict: true
})

router.post('/users', [verifyToken, validate(validations.create)], controller.create)

router.get('/users', verifyToken, controller.getAll)

router.get('/users/:id', [verifyToken, validate(validations.getById)], controller.getById)

router.delete('/users/:id', [verifyToken, validate(validations.deleteById)], controller.deleteById)

router.patch('/users/:id', [verifyToken, validate(validations.update)], controller.update)

module.exports = {
    router
}