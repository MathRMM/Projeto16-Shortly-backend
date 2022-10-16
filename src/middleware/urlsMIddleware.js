import {selectCustomerByUrlId} from '../database/dataService.js'


function createNewUrlMiddleware(req, res, next){
    const url = req.body.url
    if(!url) return res.sendStatus(422);

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