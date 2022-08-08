const { PrismaClient } = require('@prisma/client')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const { validationErrorDetails } = require('../../../utils/validation-error.details')
const { logout } = require('../auth/auth.controller')
const {utils: utilsCategory}= require('../category')

const { logger } = require('./../../../utils')

const prisma = new PrismaClient()

const getContentById = (id) => {
    return prisma.content.findUnique({
        where: {
            id
        }
    })
}

const validateCategory = async categoryId => {
    let response = true;
    const category = await utilsCategory.getCategoryById(categoryId)
    if (!category) {
        logger.error(`categoria de id ${categoryId} no existe`)
        return false
    }
    return response
}

const addContentToCategories = async (contentId, categories) => {
    categories.forEach( async categoryId => {
        try {
            if(await validateCategory(categoryId)){
                await prisma.content_X_Category.create({
                    data: {
                        contentId,
                        categoryId
                    }
                })
            }
        } catch (error){
            logger.error(`error al insertar contenido de id ${contentId}, a la categoria con id ${categoryId}`)
            logger.error(error)
        }
    });
}

const deleteContentInCategory = async contentId =>{
    try{
        await prisma.content_X_Category.deleteMany({
            where:{ 
                contentId
            }
        })
    }catch (error){
        logger.error(`Error al eliminar las categorias del conenido de id ${contentId}`)
        logger.error(error)
    }
}

const getCategoryByContent = async contentId => {
    try {
        let categories = await prisma.content_X_Category.findMany({
            where: {
                contentId
            },
            select: {
                categoryId: true
            }
        })
        return categories.map(element => element.categoryId)
    } catch (error){
        logger.error(`no se pudo encontrar las categorias para el contenido de id ${contentId}`)
        logger.error(error)
    }
}

const create = async (req, res) => {
    logger.info('creación de contenido')
    try {
        const {categories, ...newContent} = req.body
        const content = await prisma.content.create({
            data: {
                ...newContent,
            }
        })
        await addContentToCategories(content.id, categories)
        res.status(StatusCodes.CREATED).json(content)
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
        const content = await getContentById(id)
        if(!content){
            return res.sendStatus(StatusCodes.NOT_FOUND)
        }
        await deleteContentInCategory(id)
        await prisma.content.delete({
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
        const contents = await prisma.content.findMany()
        for(const content of contents ) {
            content.categories = await getCategoryByContent(content.id)
        }
        res.json(contents)
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
        const content = await getContentById(id)
        if(!content) {
            return res.sendStatus(StatusCodes.NOT_FOUND)
        }
        content.categories = await getCategoryByContent(id)
        res.json(content)
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
        const {categories, ...newContent} = req.body
        let content = await getContentById(id)
        if (!content) {
            return res.sendStatus(StatusCodes.NOT_FOUND)
        }
        content = await prisma.content.update({
            where: {
                id
            },
            data: newContent,
        })
        await deleteContentInCategory(id);
        await addContentToCategories(id, categories)
        content.categories = categories
        res.json(content)
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
    update
}