const express = require('express')

const { validate, verifyToken } = require('./../../../utils')

const controller = require('./content.controller')
const validations = require('./content.validations')

const router = express.Router({
    strict: true
})

router.post('/content', [verifyToken, validate(validations.create)], controller.create)

router.get('/contents', verifyToken, controller.getAll)

router.get('/content/:id', [verifyToken, validate(validations.getById)], controller.getById)

router.delete('/content/:id', [verifyToken, validate(validations.deleteById)], controller.deleteById)

router.patch('/content/:id', [verifyToken, validate(validations.update)], controller.update)

module.exports = {
    router
}