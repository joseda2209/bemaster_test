const express = require('express')

const { validate, verifyToken, verifyAdminstrator } = require('./../../../utils')

const controller = require('./content.controller')
const validations = require('./content.validations')

const router = express.Router({
    strict: true
})

router.post('/content', [verifyToken, verifyAdminstrator, validate(validations.create)], controller.create)

router.get('/contents', [verifyToken, verifyAdminstrator], controller.getAll)

router.get('/content/:id', [verifyToken, validate(validations.getById)], controller.getById)

router.delete('/content/:id', [verifyToken, verifyAdminstrator, validate(validations.deleteById)], controller.deleteById)

router.patch('/content/:id', [verifyToken, verifyAdminstrator, validate(validations.update)], controller.update)

module.exports = {
    router
}