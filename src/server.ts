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
            couch: data.couch
        }
    })

    return reply.status(201).send({ teamId: team.id })
});

app.get('/teams', async (request, reply) => {
    const teams = await prisma.team.findMany()

    return reply.status(200).send({ teams })
})

app.listen({ port: 3333 }).then(() => {
    console.log('Running is server')
});