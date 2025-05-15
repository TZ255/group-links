const usersModel = require('../../models/botusers')

const BroadcastConvoFn = async (bot, ctx, dt) => {
    const admins = [dt.shd, dt.htlt];
    let wapuuzi = [1006615854, 1937862156, 1652556985]

    if (!admins.includes(ctx.chat.id) || !ctx.match) {
        return await ctx.reply('Not admin or no match');
    }

    const msg_id = Number(ctx.match.trim());
    if (isNaN(msg_id)) {
        return await ctx.reply('⚠ Invalid message ID.');
    }

    const rtcopyDB = dt.rtcopyDB;
    const bads = ['deactivated', 'blocked', 'initiate', 'chat not found'];

    try {
        const count = await usersModel.countDocuments()
        // use cursor to fetch 101 docs for the first batch — after that batches sized by data volume (~4MB)
        //use .batchSize to limit docs on each batch
        const all_users = usersModel.find().select('userId').cursor()
        await ctx.reply(`🚀 Starting broadcasting for ${count} users`);

        for await (const user of all_users) {
            const chatid = user.userId;
            if (wapuuzi.includes(chatid)) continue;

            try {
                await bot.api.copyMessage(chatid, rtcopyDB, msg_id);
            } catch (err) {
                const errorMsg = err?.message?.toLowerCase() || '';
                console.log(err?.message || 'Unknown error');

                if (bads.some((b) => errorMsg.includes(b))) {
                    await usersModel.findOneAndDelete({ userId: chatid });
                    console.log(`🗑 User ${chatid} deleted for ${errorMsg}`);
                } else {
                    console.log(`🤷‍♂️ Unexpected error for ${chatid}: ${err.message}`);
                }
            }
        }

        return await ctx.reply('✅ Finished broadcasting');
    } catch (err) {
        console.error('Broadcasting error:', err?.message || err);
        await ctx.reply('❌ Broadcasting failed');
    }
};

module.exports = {BroadcastConvoFn}