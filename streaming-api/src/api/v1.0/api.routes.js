const { Router } = require('express')

const {router: userRouter} = require('./user/user.routes')
const {logger} = require('../../utils')

const router = Router()


/**
 * GET v1.0/status
 */
router.get('/status', (req, res) => {
  res.json({ status: 'OK' })
  logger.warn('entro a status')

})

router.use('/', userRouter)

module.exports = {
    router
  }