const {createHash} = require('crypto')
const { PrismaClient } = require('@prisma/client')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')

const { logger } = require('../../../utils')
const { ServerResponse } = require('http')

const prisma = new PrismaClient()

const generateAccessToken = (email, tokenSecret, tokenExpiration) => {
    return jwt.sign({email}, tokenSecret,{expiresIn: tokenExpiration})
}

const saveToken = (token, userId) => {
    return prisma.authorizorToken.create({
        data: {
            token,
            userId
        }
    })
}

const login = async(req,res) => {
    try {
        const password = createHash('sha256').update(req.body.password).digest('hex')
        const email = req.body.email;
        logger.warn(`login with email ${email}`)
        const user = await prisma.user.findFirst({
            where:{
                email,
                password
            }
        })
        if (user) {
            const token = generateAccessToken(email, process.env.TOKEN_SECRET, process.env.TOKEN_EXPIRATION)
            await saveToken(token, user.id);
            res.json({token, Rol: user.rolId})
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