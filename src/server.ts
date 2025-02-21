// import fastify from 'fastify';
// import cors from '@fastify/cors'

// import { routes } from './routes/routes';

// export const app = fastify()

// app.register(cors, {
//     origin: '*'
// })
// app.register(routes)



// app.listen({ port: 3333 }).then(() => {
//     console.log('Running is server')
// });

import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import z from 'zod'

const app = express()
const prisma = new PrismaClient()
app.use(cors({
    origin: '*'
}))
app.use(express.json())


app.post('/teams', async (request: any, response: any) => {

    const TeamsSchema = z.object({
        name: z.string(),
        city: z.string(),
        couch: z.string().min(4),
        cpf: z.string()
    })

    const data = TeamsSchema.parse(request.body)

    const team = await prisma.team.create({
        data: {
            name: data.name,
            city: data.city,
            couch: data.couch,
            cpf: data.cpf
        }
    })

    return response.status(201).send({ teamId: team.id })
});

app.get('/teams', async (request: any, response: any) => {
    const teams = await prisma.team.findMany({
        include: {
            players: true
        }
    })

    return response.status(200).send({ teams })
})

app.get('/teams/only/:id', async (request: any, response: any) => {
    const IdSearcSchema = z.object({
        id: z.string()
    })

    const data = IdSearcSchema.parse(request.params)

    const team = await prisma.team.findFirst({
        where: {
            id: data.id
        }
    })

    if (!team?.id) {
        return response.status(402).send({ message: "Dados Incorretos" })
    }

    const costTeam = await prisma.team.findMany({
        where: {
            id: team.id
        }
    })

    return response.status(200).send(team)
})

app.get('/teams/:id', async (request: any, response: any) => {
    const IdSearcSchema = z.object({
        id: z.string()
    })

    const data = IdSearcSchema.parse(request.params)

    const team = await prisma.team.findFirst({
        where: {
            id: data.id
        }
    })

    if (!team?.id) {
        return response.status(402).send({ message: "Dados Incorretos" })
    }

    const costTeam = await prisma.player.findMany({
        where: {
            teamId: team.id
        }
    })

    return response.status(200).send(costTeam)
})

app.post('/players', async (request: any, response: any) => {
    const PlayerSchema = z.object({
        name: z.string().min(8),
        cpf: z.string().min(11),
        rg: z.string().min(6),
        address: z.string(),
        birthdate: z.string(),
        nameMother: z.string(),
        nameFather: z.string(),
        id: z.string()
    })


    const data = PlayerSchema.parse(request.body)

    const teamIdSearch = await prisma.team.findFirst({
        where: {
            id: data.id
        }
    })
    // console.log(teamIdSearch?.id)
    if (!teamIdSearch) {
        return response.status(402).send({ message: 'Time Não Selecionado' })
    }
    const player = await prisma.player.create({
        data: {
            name: data.name,
            cpf: data.cpf,
            rg: data.rg,
            address: data.address,
            birthdate: data.birthdate,
            nameMother: data.nameMother,
            nameFather: data.nameFather,
            teamId: teamIdSearch.id
        }
    })

    return response.status(201).send({ playerId: player.id })
})

app.post('/login', async (request: any, response: any) => {
    const tcpf = z.object({
        cpf: z.string()
    })

    const data = tcpf.parse(request.body)

    const team = await prisma.team.findFirst({
        where: {
            cpf: data.cpf
        }
    })

    if (!team?.id) {
        return response.status(400).send({ message: 'CPF invalido para o login' })
    }

    return response.status(200).send(team)
})

app.delete('/players/:id', async (request: any, reply: any) => {
    const playerId = z.object({
        id: z.string()
    })

    const data = playerId.parse(request.params)

    const player = await prisma.player.findFirst({
        where: {
            id: data.id
        }
    })

    if (!player?.id) {
        return reply.status(400).send({ message: 'Jogador não encontrado' })
    }

    const response = await prisma.player.delete({
        where: {
            id: data.id
        }
    })

    return reply.status(200).send({ message: 'jogador deletado' })
})

app.get('/player/:id', async (request: any, response: any) => {
    const playerId = z.object({
        id: z.string()
    })

    const playerIdSchema = playerId.parse(request.params)

    const data = await prisma.player.findFirst({
        where: {
            id: playerIdSchema.id
        },
        include: {
            Team: false
        }
    })

    return response.status(200).send(data)
})

app.put('/player/:id', async (request: any, response: any) => {
    const playerId = z.object({
        id: z.string()
    })


    const playerIdSchema = playerId.parse(request.params)

    const data = await prisma.player.findFirst({
        where: {
            id: playerIdSchema.id
        },
        include: {
            Team: false
        }
    })

    if (data?.id) {
        const bodyPlayerSchema = z.object({
            name: z.string().min(6),
            cpf: z.string().min(11),
            rg: z.string().min(6),
            address: z.string(),
            birthdate: z.string(),
            nameMother: z.string(),
            nameFather: z.string(),
        })

        const dataUp = bodyPlayerSchema.parse(request.body)
        const player = await prisma.player.update({
            where: {
                id: data.id
            },
            data: dataUp
        })

        return response.status(201).send(player)

    }
    return response.status(400).send({ message: 'Id Invalido' })
})

app.listen(3333, () => { console.log('Server is Running') })