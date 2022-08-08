const { createHash } = require('crypto')
const { PrismaClient } = require('@prisma/client')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')

const { logger } = require('./../../../utils')

const prisma = new PrismaClient()

const getUserById = (id) => {
    return prisma.user.findUnique({
        where: {
            id
        }
    })
}

const create = async (req, res) => {
    logger.info('creación de usuario')
    try {
        const password = createHash('sha256').update(req.body.password).digest('hex')
        const user = await prisma.user.create({
            data: {
                ...req.body,
                password
            }
        })
        res.status(StatusCodes.CREATED).json(user)
    } catch (error) {
        logger.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error: ReasonPhrases.INTERNAL_SERVER_ERROR})
    } finally {
        await prisma.$disconnect()
    }
}

const deleteById = async (req,res) => {
    try {
        const id = Number(req.params.id)
        const user = await getUserById(id)
        if(!user){
            return res.sendStatus(StatusCodes.NOT_FOUND)
        }
        await prisma.user.delete({
            where: {
                id
            }
        })
        res.sendStatus(StatusCodes.NO_CONTENT)
    } catch (error) {
        logger.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error: ReasonPhrases.INTERNAL_SERVER_ERROR})
    } finally {
        await prisma.$disconnect()
    }
}

const getAll = async (req, res) => {
    try {
        const users = await prisma.user.findMany()
        res.json(users)
    } catch (error) {
        logger.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error: ReasonPhrases.INTERNAL_SERVER_ERROR})
    } finally {
        await prisma.$disconnect()
    }
}

const getById = async (req,res) => {
    try {
        const id = Number(req.params.id)
        const user = await getUserById(id)
        if(!user) {
            return res.sendStatus(StatusCodes.NOT_FOUND)
        }
        res.json(user)
    } catch (error) {
        logger.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error: ReasonPhrases.INTERNAL_SERVER_ERROR})
    } finally {
        await prisma.$disconnect()
    }
}

const update = async (req, res) => {
    try {
        const id = Number(req.params.id)
        let user = await getUserById(id)
        if (!user) {
            return res.sendStatus(StatusCodes.NOT_FOUND)
        }
        user = await prisma.user.update({
            where: {
                id
            },
            data: req.body,
        })
        res.json(user)
    } catch (error) {
        logger.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error: ReasonPhrases.INTERNAL_SERVER_ERROR})
    } finally {
        await prisma.$disconnect()
    }
}

const addContentToUser = async (req,res) => {
    try {
        const userId = Number(req.params.id)
        const contents = req.body.contents
        const user = await getUserById(userId)
        if (!user) {
            return res.sendStatus(StatusCodes.NOT_FOUND)
        }
        await prisma.user_X_Content.deleteMany({
            where:{
                userId
            }
        })
        for(const contentId of contents){
            await prisma.user_X_Content.create({
                data:{
                    contentId,
                    userId
                }
            })
        }
        res.sendStatus(StatusCodes.NO_CONTENT)
    } catch (error) {
        logger.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error: ReasonPhrases.INTERNAL_SERVER_ERROR})
    } finally {
        await prisma.$disconnect()
    }
}

const getContentByUser = async (req,res) => {
    try {
        const userId = Number(req.params.id)
        let contents = await prisma.user_X_Content.findMany({
            where:{
                userId
            },
            select: {
                content: true
            } 
        })
        res.json(contents.map(element => element.content))
    } catch (error) {
        logger.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error: ReasonPhrases.INTERNAL_SERVER_ERROR})
    } finally {
        await prisma.$disconnect()
    }
}

module.exports = {
    create,
    deleteById,
    getAll,
    getById,
    update,
    addContentToUser,
    getContentByUser
}