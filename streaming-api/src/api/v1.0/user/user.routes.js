const express = require('express')

const { validate, verifyToken } = require('./../../../utils')

const controller = require('./user.controller')
const validations = require('./user.validations')

const router = express.Router({
    strict: true
})

router.post('/user', [verifyToken, validate(validations.create)], controller.create)

router.get('/users', verifyToken, controller.getAll)

router.get('/user/:id', [verifyToken, validate(validations.getById)], controller.getById)

router.delete('/user/:id', [verifyToken, validate(validations.deleteById)], controller.deleteById)

router.patch('/user/:id', [verifyToken, validate(validations.update)], controller.update)

router.post('/user/:id/content',[verifyToken,validate(validations.addContentToUser)], controller.addContentToUser)

router.get('/user/:id/content',[verifyToken,validate(validations.addContentToUser)], controller.getContentByUser)

module.exports = {
    router
}