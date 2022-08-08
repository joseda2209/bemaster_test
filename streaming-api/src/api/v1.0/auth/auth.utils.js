const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const {logger} = require('../../../utils/logger')

const prisma = new PrismaClient()



const generateAccessToken = async (payload, userId) => {
    try {
        const token =  jwt.sign({...payload, userId}, process.env.TOKEN_SECRET, {expiresIn: process.env.TOKEN_EXPIRATION})
        logger.warn(token)
        await deleteTokens(userId)
        await saveToken(token, userId);
        return token;
    } catch (error) {
        logger.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error: ReasonPhrases.INTERNAL_SERVER_ERROR})
    } finally {
        await prisma.$disconnect()
    }
}

const saveToken = (token, userId) => {
    logger.warn('save')
    return prisma.authorizorToken.create({
        data: {
            token,
            userId
        }
    })
}

const deleteTokens = (userId) => {
    return prisma.authorizorToken.deleteMany({
        where:{
            userId
        }
    })
}

module.exports = {
    generateAccessToken
}