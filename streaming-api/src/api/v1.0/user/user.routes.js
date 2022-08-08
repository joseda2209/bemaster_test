const express = require('express')

const { validate, verifyToken, verifyAdminstrator } = require('./../../../utils')

const controller = require('./user.controller')
const validations = require('./user.validations')

const router = express.Router({
    strict: true
})

router.post('/user', [verifyToken, verifyAdminstrator, validate(validations.create)], controller.create)

router.get('/users', [verifyToken, verifyAdminstrator], controller.getAll)

router.get('/user/:id', [verifyToken, validate(validations.getById)], controller.getById)

router.delete('/user/:id', [verifyToken, verifyAdminstrator, validate(validations.deleteById)], controller.deleteById)

router.patch('/user/:id', [verifyToken, verifyAdminstrator, validate(validations.update)], controller.update)

router.post('/user/:id/content',[verifyToken,verifyAdminstrator, validate(validations.addContentToUser)], controller.addContentToUser)

router.get('/user/:id/content',[verifyToken,validate(validations.addContentToUser)], controller.getContentByUser)

module.exports = {
    router
}