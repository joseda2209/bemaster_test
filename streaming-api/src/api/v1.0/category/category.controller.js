const { PrismaClient } = require('@prisma/client')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const utils = require('./category.utils')

const { logger } = require('./../../../utils')

const prisma = new PrismaClient()


const create = async (req,res) => {
    logger.info('creación de categoria')
    try {
        const name = req.body.name;
        const category = await prisma.catogory.create({
            data: {
                name
            }
        })
        res.status(StatusCodes.CREATED).json(category)
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
        const category = await utils.getCateogryById(id)
        if(!category){
            return res.sendStatus(StatusCodes.NOT_FOUND)
        }
        await prisma.catogory.delete({
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
        const categories = await prisma.catogory.findMany()
        res.json(categories)
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
        const category = await utils.getCateogryById(id)
        if(!category) {
            return res.sendStatus(StatusCodes.NOT_FOUND)
        }
        res.json(category)
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
    getById
}
