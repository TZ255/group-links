const usersModel = require('../../models/botusers')

const BroadcastConvoFn = async (bot, ctx, dt) => {
    if ([dt.shd, dt.htlt].includes(ctx.chat.id) && ctx.match) {
        let msg_id = Number(ctx.match.trim())
        let bads = ['deactivated', 'blocked', 'initiate', 'chat not found']
        let wapuuzi = [1006615854, 1937862156, 1652556985]
        try {
            let all_users = await usersModel.find()
            await ctx.reply(`Starting broadcasting for ${all_users.length} users`)

            all_users.forEach((u, i) => {
                if (!wapuuzi.includes(u.userId)) {
                    setTimeout(() => {
                        bot.api.copyMessage(u.userId, dt.matangazoDB, msg_id)
                            .then(() => {
                                if (i === all_users.length - 1) {
                                    ctx.reply('✅ Broadcasted').catch(e => console.log(e.message))
                                }
                            })
                            .catch((err) => {
                                if (bads.some((b) => err?.message.toLowerCase().includes(b))) {
                                    u.deleteOne()
                                    console.log(`${u?.chatid} deleted`)
                                } else {
                                    console.log(`🤷‍♂️ ${err.message}`)
                                }
                            })
                    }, i * 50)
                }
            })
        } catch (err) {
            console.log(err?.message)
        }
    }
}

module.exports = {BroadcastConvoFn}