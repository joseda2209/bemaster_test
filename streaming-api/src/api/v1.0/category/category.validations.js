const Joi = require('joi')
const { PrismaClient } = require('@prisma/client')

const { validationErrorDetails } = require('../../../utils/validation-error.details')
const { deleteById } = require('../user/user.validations')

const prisma = new PrismaClient()

const categoryId = Joi.object({
    id: Joi.number().integer().positive().required()
})

const uniqueName = async (name) => {
    const category = await prisma.catogory.findUnique({
        where: {
            name
        }
    })
    if (category) {
        const message = `Categoria de nombre ${name} ya existe`
        throw new Joi.ValidationError(
            message,
            validationErrorDetails('name', message)
        )
    }
}

module.exports = {
    create: {
        payload: Joi.object({
            name:       Joi.string().required().external((name) => uniqueName(name))
        }).unknown(false)
    },

    deleteById: {
        params: categoryId
    },
    getById: {
        params: categoryId
    }
}