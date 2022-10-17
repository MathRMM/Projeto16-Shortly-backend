import express from 'express'
import cors from 'cors'

import authRoutes from './routes/authRoutes.js'
import urlsRoutes from './routes/urlsRoutes.js'
import usersRouter from './routes/usersRoutes.js'

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000

app.use(authRoutes, urlsRoutes, usersRouter);

app.listen(PORT, console.log(`listen on port ${PORT}`));