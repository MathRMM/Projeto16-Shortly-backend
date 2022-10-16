import express from 'express'
import cors from 'cors'

import authRoutes from './routes/authRoutes.js'
import urlsRoutes from './routes/urlsRoutes.js'
import usersRouter from './routes/usersRoutes.js'

const app = express();
app.use(express.json());
app.use(cors());

app.use(authRoutes, urlsRoutes, usersRouter);

app.listen(5000, console.log('listen on port 5000'));