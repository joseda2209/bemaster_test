const controller = require('./category.controller')
const router = require('./category.routes')
const validation = require('./category.validations')

module.exports = {
    router,
    controller,
    validation
}