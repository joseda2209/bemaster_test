const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const {PrismaClient} = require('@prisma/client')
const { logger } = require('./logger')
const utilsToken = require('../api/v1.0/auth/auth.utils')
const prisma = new PrismaClient();


const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader? authHeader.split(' ')[1] : undefined
  logger.warn(token)
  const authToken = await getToken(token);
  if (authToken) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (error, token2) => {
      if (error) {
        await deleteToken(authToken)
        console.log(error.message)
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "la sesion ha expirado" })
      }
      logger.info('token verificado')
      const {email, rol, userId} = jwt.decode(token)
      const newToken = await utilsToken.generateAccessToken({email, rol}, userId)
      req.rolId = rol
      res.set('token', newToken)
      next()
    })
  } else {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "no existe una sesion" })
  }
}

const getToken = (token) => {
  if (token) {
    return prisma.authorizorToken.findFirst({
       where: {
         token
       }
     })
  }
}
const deleteToken = (authToken) => {
   prisma.authorizorToken.delete({
    where: {
        id: authToken.id
    }
});
}

module.exports = { verifyToken }