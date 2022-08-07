const express = require('express')

const { validate, verifyToken } = require('./../../../utils')

const controller = require('./category.controller')
const validations = require('./category.validations')

const router = express.Router({
    strict: true
})

//POST /v1.0/category
router.post('/category', [verifyToken, validate(validations.create)], controller.create)

//GET /v1.0/categories
router.get('/categories', verifyToken, controller.getAll)

//GET /v1.0/category/:id
router.get('/category/:id', [verifyToken, validate(validations.getById)], controller.getById)

//DELETE /v1.0/category
router.delete('/category/:id', [verifyToken, validate(validations.deleteById)], controller.deleteById)

module.exports = {
    router
}