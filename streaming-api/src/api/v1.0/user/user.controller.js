const { createHash } = require('crypto')
const { PrismaClient } = require('@prisma/client')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')

const { logger } = require('./../../../utils')
const { number } = require('joi')

const prisma = new PrismaClient()

const getUserById = (id) => {
    return prisma.user.findUnique({
        where: {
            id
        }
    })
}

const create = async (req, res) => {
    logger.info('entro a create')
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
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
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
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
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
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
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
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
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
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
    } finally {
        await prisma.$disconnect()
    }
}

module.exports = {
    create,
    deleteById,
    getAll,
    getById,
    update
}