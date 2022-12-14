const { Router } = require('express')

const {router: userRouter} = require('./user/user.routes')
const {router: authRouter} = require('./auth/auth.routes')
const {router: categoryRouter} = require('./category/category.routes')
const {router: contentRouter} = require('./content/content.routes')
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
router.use('/', authRouter)
router.use('/',categoryRouter)
router.use('/',contentRouter)

module.exports = {
    router
  }