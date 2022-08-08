const controller = require('./content.controller')
const router = require('./content.routes')
const validation = require('./content.validations')

module.exports = {
    router,
    controller,
    validation
}