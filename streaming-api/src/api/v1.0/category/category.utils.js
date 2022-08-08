const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


const getCategoryById = (id) => {
    return prisma.catogory.findUnique({
        where: {
            id
        }
    })
}


module.exports = {
    getCategoryById
}
