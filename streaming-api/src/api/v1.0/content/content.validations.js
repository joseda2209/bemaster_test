const Joi = require('joi')


const contentId = Joi.object({
    id: Joi.number().integer().positive().required()
})
const content = Joi.object({
    name:           Joi.string().required(),
    author:         Joi.string().required(),
    duration:       Joi.number().integer().positive().required(),
    year:           Joi.number().integer().positive().required(),
    synopsis:       Joi.string(),
    url:            Joi.string().required(),
    categories:     Joi.array().items(Joi.number().integer().positive())
}).unknown(false)

module.exports = {
    create: {
        payload: content
    },
    deleteById: {
        params: contentId
    },
    getById: {
        params: contentId
    },
    update: {
        params: contentId,
        payload: content
    }
}