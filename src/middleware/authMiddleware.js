import bcrypt from 'bcrypt';

import {selectSession} from '../database/dataService.js'

function signUpMiddleware(req, res, next) {
    const { name, email, password, confirmPassword } = req.body
    if (!name, !email, !password, !confirmPassword) return res.sendStatus(422);

    if (password !== confirmPassword) return res.status(422).send({ message: 'Senha e Confirme Senha estão diferentes' })
    const hashPassword = bcrypt.hashSync(password, Number(process.env.SALT));
    res.locals.customer = {
        name,
        email,
        hashPassword,
    }
    next()
}

function signInMiddleware(req, res, next) {
    const { email, password } = req.body
    if (!email, !password) return res.sendStatus(422);
    res.locals.customer = {
        email,
        password
    }
    next()
}

async function  authToken(req, res, next){
    const { authorization } = req.headers
    if(!authorization) return res.sendStatus(401)

    try {
        const customer = await selectSession(authorization.replace('Bearer ', ''))
        if(!customer[0]) return res.sendStatus(401)
        res.locals.customer = customer[0]
        next()
    } catch (error) {
        res.sendStatus(500)
    }
}

export { 
    signUpMiddleware,
    signInMiddleware,
    authToken
}