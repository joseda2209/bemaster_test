const express = require('express')

const { validate, verifyToken } = require('./../../../utils')

const controller = require('./user.controller')
const validations = require('./user.validations')

const router = express.Router({
    strict: true
})

router.post('/users', validate(validations.create), controller.create)

router.get('/users', controller.getAll)

router.get('/users/:id', validate(validations.getById), controller.getById)

router.delete('/users/:id', validate(validations.deleteById), controller.deleteById)

router.patch('/users/:id', validate(validations.update), controller.update)

module.exports = {
    router
}