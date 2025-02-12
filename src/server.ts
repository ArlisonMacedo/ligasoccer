import fastify from 'fastify';
import z from 'zod';
import { PrismaClient } from '@prisma/client';

const app = fastify()

const prisma = new PrismaClient({
    log: ['query']
})

app.post('/teams', async (request, reply) => {

    const TeamsSchema = z.object({
        name: z.string(),
        city: z.string(),
        couch: z.string().min(4),
    })
    console.log(request.body)

    const data = TeamsSchema.parse(request.body)

    const team = await prisma.team.create({
        data: {
            name: data.name,
            city: data.city,
            couch: data.couch,
        }
    })

    return reply.status(201).send({ teamId: team.id })
});

app.get('/teams', async (request, reply) => {
    const teams = await prisma.team.findMany()

    return reply.status(200).send({ teams })
})

app.post('/players', async (request, reply) => {
    const PlayerSchema = z.object({
        name: z.string().min(8),
        cpf: z.string().min(11),
        rg: z.string().min(6),
        address: z.string()
    })

    const data = PlayerSchema.parse(request.body)

    const player = await prisma.player.create({
        data: {
            name: data.name,
            cpf: data.cpf,
            rg: data.rg,
            address: data.address
        }
    })

    return reply.status(201).send({ playerId: player.id })
})

app.listen({ port: 3333 }).then(() => {
    console.log('Running is server')
});