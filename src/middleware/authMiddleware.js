import bcrypt from "bcrypt";

import { selectSession } from "../repositories/repositories.js";
import * as schemas from "./helpers/joiSchemas.js";

function signUpMiddleware(req, res, next) {
    const { name, email, password, confirmPassword } = req.body;

    const validation = schemas.signUpSchemas.validate(
        {
            name,
            email,
            password,
            confirmPassword,
        },
        { abortEarly: false }
    );

    if (validation.error) {
        const errors = validation.error.details.map(
            (detail) => detail?.context?.label
        );
        return res.status(422).send({ message: errors });
    }

    const hashPassword = bcrypt.hashSync(password, Number(process.env.SALT));

    res.locals.customer = {
        name,
        email,
        hashPassword,
    };
    next();
}

function signInMiddleware(req, res, next) {
    const { email, password } = req.body;

    const validation = schemas.signInSchemas.validate(
        {
            email,
            password,
        },
        { abortEarly: false }
    );

    if (validation.error) {
        const errors = validation.error.details.map(
            (detail) => detail?.context?.label
        );
        return res.status(422).send({ message: errors });
    }

    res.locals.customer = {
        email,
        password,
    };
    next();
}

async function authToken(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) return res.sendStatus(401);
    const token = authorization.replace("Bearer ", "");

    const validation = schemas.tokenSchema.validate(
        {
            token,
        },
        { abortEarly: false }
    );

    if (validation.error) {
        const errors = validation.error.details.map(
            (detail) => detail?.context?.label
        );
        return res.status(422).send({ message: errors });
    }

    try {
        const customer = await selectSession(token);
        if (!customer[0]) return res.sendStatus(401);
        res.locals.customer = customer[0];
        next();
    } catch (error) {
        res.sendStatus(500);
    }
}

export { signUpMiddleware, signInMiddleware, authToken };
