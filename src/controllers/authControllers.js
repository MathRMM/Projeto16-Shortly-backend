import bcrypt from 'bcrypt'
import {v4 as uuid} from 'uuid'

import { createNewCustomer, selectCustomer, createNewSession } from '../repositories/repositories.js';

async function signUpController(req, res) {
    const customer = res.locals.customer

    try {
        await createNewCustomer(customer);
        return res.sendStatus(201);
    } catch (error) {
        console.error(error)
        if (error.code === '23505') return res.status(409).send({ message: 'Usuario ja existente' })
        return res.sendStatus(500);
    }
}

async function signInController(req, res) {
    const { email, password } = res.locals.customer
    const date = new Date(Date.now())

    try {
        const costumer = await selectCustomer(email);
        if(!costumer[0]) return res.sendStatus(401);
        if(!bcrypt.compareSync(password, costumer[0].hashPassword))return res.sendStatus(401);
        const token = uuid()
        await createNewSession({
            customerId: costumer[0].id,
            token,
            lastStatus: date.toLocaleString('en-US')
        });
        res.send({token,});
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

export {
    signUpController,
    signInController
}