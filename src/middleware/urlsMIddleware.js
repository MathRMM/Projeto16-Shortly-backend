import {selectCustomerByUrlId} from '../repositories/repositories.js'
import * as schemas from "./helpers/joiSchemas.js";


function createNewUrlMiddleware(req, res, next){
    const url = req.body.url
    
    const validation = schemas.newUrlSchema.validate(
        {
            url,
        },
        { abortEarly: false }
    );

    if (validation.error) {
        const errors = validation.error.details.map(
            (detail) => detail?.context?.label
        );
        return res.status(422).send({ message: errors });
    }

    res.locals.url = url
    next();
}


async function deleteUrlMiddleware(req, res, next) {
    const urlId = req.params.id
    const customer = res.locals.customer

    try {
        const urlCustomerId = await selectCustomerByUrlId(urlId);
        if(!urlCustomerId[0]) return res.sendStatus(404);
        if(customer.id !== urlCustomerId[0].id) return res.sendStatus(401);
        res.locals.urlId = urlId
        next()
    } catch (error) {
        console.error(error)
        return res.sendStatus(500)
    }
}

export {
    createNewUrlMiddleware,
    deleteUrlMiddleware
}