import { z } from "zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";

export async function routes(app: FastifyInstance) {
    app.post('/teams', async (request, reply) => {

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

        return reply.status(201).send({ teamId: team.id })
    });

    app.get('/teams', async (request, reply) => {
        const teams = await prisma.team.findMany({
            include: {
                players: true
            }
        })

        return reply.status(200).send({ teams })
    })

    app.get('/teams/only/:id', async (request, reply) => {
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
            return reply.status(402).send({ message: "Dados Incorretos" })
        }

        const costTeam = await prisma.team.findMany({
            where: {
                id: team.id
            }
        })

        return reply.status(200).send(team)
    })

    app.get('/teams/:id', async (request, reply) => {
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
            return reply.status(402).send({ message: "Dados Incorretos" })
        }

        const costTeam = await prisma.player.findMany({
            where: {
                teamId: team.id
            }
        })

        return reply.status(200).send(costTeam)
    })

    app.post('/players', async (request, reply) => {
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
            return reply.status(402).send({ message: 'Time Não Selecionado' })
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

        return reply.status(201).send({ playerId: player.id })
    })

    app.post('/login', async (request, reply) => {
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
            return reply.status(400).send({ message: 'CPF invalido para o login' })
        }

        return reply.status(200).send(team)
    })

    app.delete('/players/:id', async (request, reply) => {
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

    app.get('/player/:id', async (request, reply) => {
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

        return reply.status(200).send(data)
    })

    app.put('/player/:id', async (request, reply) => {
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

            return reply.status(201).send(player)

        }
        return reply.status(400).send({ message: 'Id Invalido' })
    })
}

