const {StatusCodes, ReasonPhrases} = require('http-status-codes')
const {PrismaClient} = require('@prisma/client')
const {logger} = require('./logger')

const prisma = new PrismaClient();


const verifyAdminstrator = async (req, res, next) => {
    const rol = await prisma.rol.findFirst({
        where:{
            id: req.rolId
        }
    })
    if (rol.name !== 'Administrador'){
        const mensaje = 'No tiene el rol necesario para ingresar a esta opción'
        logger.error(mensaje)
        return res.status(StatusCodes.BAD_REQUEST).json({error: mensaje})
    }
    next()
}

module.exports = {
    verifyAdminstrator
}