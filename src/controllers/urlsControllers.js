import { nanoid } from 'nanoid'

import { createNewUrl, deleteUrl, selectUrlById, selectUrlByShort } from '../repositories/repositories.js';

async function createNewUrlController(req, res) {
    const url = res.locals.url
    const customer = res.locals.customer
    const shortUrl =  nanoid()

    try {
        await createNewUrl({
            customerId: customer.id,
            url: url,
            shortUrl,
        })
        return res.status(201).send({shortUrl,})
    } catch (error) {
        console.error(error)
        return res.sendStatus(500)
    }
}

async function selectUrlByIdController(req, res) {
    const id = req.params.id

    try {
        const url = await selectUrlById(id);
        if (!url[0]) return res.sendStatus(404);
        return res.send(url);
    } catch (error) {
        console.error(error)
        return res.sendStatus(500);
    }
}

async function selectUrlByShortController(req, res) {
    const short = req.params.shortUrl

    try {
        const url = await selectUrlByShort(short);
        if (!url[0]) return res.sendStatus(404)
        return res.redirect(url[0].url)
    } catch (error) {
        console.error(error)
        return res.sendStatus(500)
    }
}

async function deleteUrlController(req, res){
    const urlId = res.locals.urlId

    try {
        await deleteUrl(urlId)
        return res.sendStatus(204)
    } catch (error) {
        console.error(error)
        return res.sendStatus(500)
    }
}

export {
    createNewUrlController,
    selectUrlByIdController,
    selectUrlByShortController,
    deleteUrlController
}