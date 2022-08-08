const controller = require('./category.controller')
const router = require('./category.routes')
const validation = require('./category.validations')
const utils = require('./category.utils')

module.exports = {
    router,
    controller,
    validation,
    utils
}