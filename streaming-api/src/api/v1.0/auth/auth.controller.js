const {createHash} = require('crypto')
const { PrismaClient } = require('@prisma/client')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const {generateAccessToken} = require('./auth.utils')
const { logger } = require('../../../utils')
const { ServerResponse } = require('http')

const prisma = new PrismaClient()


const login = async(req,res) => {
    try {
        logger.warn(`request ${req.body}`)
        const password = createHash('sha256').update(req.body.password).digest('hex')
        const email = req.body.email;
        logger.warn(`login with email ${email}`)
        const user = await prisma.user.findFirst({
            where:{
                email,
                password
            }
        })
        logger.warn(JSON.stringify(user))
        if (user) {
            const token = await generateAccessToken({email, rol: user.rolId}, user.id)
            res.json({token, user})
        } else {
            const error = 'Datos de ingreso invalidos'
            logger.error(error)
            res.status(StatusCodes.NOT_FOUND).send({error})
        }
    } catch(err) {
        logger.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error: ReasonPhrases.INTERNAL_SERVER_ERROR})
    } finally {
        await prisma.$disconnect()
    }
}

const logout = async (req,res) => {
    try {
        logger.warn('logout')
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        const authToken = await getAuthToken(token);
        if (authToken) {
            await prisma.authorizorToken.delete({
                where: {
                    id: authToken.id
                }
            })
        }
        res.sendStatus(StatusCodes.NO_CONTENT)
    } catch (error) {
        logger.error(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error: ReasonPhrases.INTERNAL_SERVER_ERROR})
    } finally {
        await prisma.$disconnect()
    }
}

const getAuthToken = token => {
    return prisma.authorizorToken.findFirst({
        where: {
            token
        }
    })
}

module.exports = {
    login,
    logout
}