import {selectRanking, selectVisitsUrls} from '../database/dataService.js'

async function usersProperty(req, res){
    const customer = res.locals.customer
    let visitCount = 0
    const profile = {
        id: customer.id,
        name:customer.name,
    }
    
    try {
        const views = await selectVisitsUrls(customer.id);
        views.map(e => visitCount += Number(e.visitCount));
        profile.visitCount = visitCount
        profile.shortenedUrls = views
        return res.status(200).send(profile)
    } catch (error) {
        console.error(error)
        return res.sendStatus(500)
    }
}

async function rankingController(req, res){
    try {
        const ranking = await selectRanking()
        return res.status(200).send(ranking)
    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
}

export {
    usersProperty,
    rankingController
}