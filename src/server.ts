import fastify from 'fastify';
import cors from '@fastify/cors'

import { routes } from './routes/routes';

export const app = fastify()

app.register(cors, {
    origin: '*'
})
app.register(routes)



app.listen({ port: 3333 }).then(() => {
    console.log('Running is server')
});