const dramasModel = require('../../models/vue-new-drama')
const episodesModel = require('../../models/vue-new-episode')
const nextEpModel = require('../../models/botnextEp')
const usersModel = require('../../models/botusers')
const inviteModel = require('../../models/invitelink')

const UpdateChanUser = async (ctx, ep_doc) => {
    try {
        //update channel count
        await dramasModel.findOneAndUpdate({ chan_id: ep_doc.drama_chan_id }, { $inc: { timesLoaded: 30, thisMonth: 29, thisWeek: 29, today: 29 } })
        console.log(ep_doc.drama_name + ' 30 loaded added')

        //check if user available to db
        let user = await usersModel.findOne({ userId: ctx.chat.id })
        if (!user) {
            let fname = ctx.chat.first_name
            if (ctx.chat.username) {
                fname = '@' + ctx.chat.username
            }
            let blocked = false
            let country = { name: 'unknown', c_code: 'unknown' }
            let userId = ctx.chat.id
            let points = 10
            let downloaded = 0
            await usersModel.create({ fname, blocked, country, userId, points, downloaded })
            console.log('new user from offer added')
        } else {
            if (ctx.chat.username) {
                if (user.fname != `@${ctx.chat.username}`) {
                    await usersModel.findOneAndUpdate({ userId: ctx.chat.id }, { $set: { fname: `@${ctx.chat.username}` } })
                }
            } else {
                if (user.fname != ctx.chat.first_name) {
                    await usersModel.findOneAndUpdate({ userId: ctx.chat.id }, { $set: { fname: ctx.chat.first_name } })
                }
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    UpdateChanUser
}