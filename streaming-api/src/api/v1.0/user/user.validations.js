const Joi = require('joi')
const { PrismaClient } = require('@prisma/client')

const { validationErrorDetails } = require('../../../utils/validation-error.details')

const prisma = new PrismaClient()

const userId = Joi.object({
    id: Joi.number().integer().positive().required()
})

const uniqueEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (user) {
        const message = `User with email ${email} already exists.`
        throw new Joi.ValidationError(
            message,
            validationErrorDetails('email', message)
        )
    }
    return true;
}

const uniqueDocument = async (document) => {
    const user = await prisma.user.findUnique({
      where: {
        document
      }
    })
    if (user) {
      const message = `Usuario con documento ${document} ya existe.`
      throw new Joi.ValidationError(
        message,
        validationErrorDetails('document', message)
      )
    }
    return true
  }

module.exports = {
    //POST /v1.0/users
    create: {
        payload: Joi.object({
            name:       Joi.string().required(),
            lastname:   Joi.string().required(),
            email:      Joi.string().required().external((email) => uniqueEmail(email)),
            password:   Joi.string().required(),
            document:   Joi.string().required().external((document) => uniqueDocument(document)),
            rolId:      Joi.number().integer().positive().required()
        }).unknown(false)
    },
    deleteById: {
        // DELETE /v1.0/users/:id
        params: userId
    },
    getById: {
        // GET /v1.0/users/:id
        params: userId
    },
    update: {
        // PATCH /v1.0/users/:id
        params: userId,
        payload: Joi.object({
            name:       Joi.string().required(),
            lastname:   Joi.string().required(),
            email:      Joi.string().required().external((email) => uniqueEmail(email)),
            document:   Joi.string().required().external((document) => uniqueDocument(document)),
            rolId:      Joi.number().integer().positive().required()
        }).unknown(false)
    }
}