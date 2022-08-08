const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


const getCateogryById = (id) => {
    return prisma.catogory.findUnique({
        where: {
            id
        }
    })
}


module.exports = {
    getCateogryById
}
