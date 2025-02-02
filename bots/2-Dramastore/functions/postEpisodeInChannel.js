const vueNewDramaModel = require('../models/vue-new-drama')
const episodesModel = require('../models/vue-new-episode')
const postModel = require('../models/postmodel')
const usersModel = require('../models/botusers')
const {scrapeMyDramalist, scrapeAsianWiki, TelegraphPage} = require('./partials/scrapingdrama')
const UploadingNewEpisode = require('./partials/uploading_new_episode')

module.exports = async (bot, ctx, next, dt, anyErr, delay) => {
    try {
        // check if it is used in channel
        if (ctx.update.channel_post) {
            // check if it is dramastore database
            if (ctx.update.channel_post.sender_chat.id == dt.databaseChannel) {
                // check if ni document
                if (ctx.update.channel_post.document) {
                    let msgId = ctx.update.channel_post.message_id
                    let fileName = ctx.update.channel_post.document.file_name
                    let fileZize = ctx.channelPost.document.file_size
                    let SizeInMB = (fileZize / (1024 * 1024))
                    let netSize = Math.trunc(SizeInMB)
                    let noEp = ''
                    let capQty = '540P HDTV H.264'
                    let muxed = '#English Soft-subbed'
                    let extraParams = ''

                    //document spillited with dramastore
                    if (fileName.includes('[dramastore.net] ')) {
                        noEp = fileName.split('[dramastore.net] ')[1].split('.')[0]
                    } else if (fileName.includes('@dramaost.')) {
                        noEp = fileName.split('@dramaost.E')[1].split('.')[0]
                    }

                    if (fileName.toLowerCase().includes('480p.web')) {
                        capQty = '480P WEBDL'
                        extraParams = '480p_WEBDL'
                    }

                    if (fileName.toLowerCase().includes('480p.hdtv.mp4')) {
                        capQty = '480P HDTV H.264'
                        muxed = '#English Hard-subbed (kissasian)'
                        extraParams = '480p_HDTV_MP4'
                    }

                    else if (fileName.toLowerCase().includes('540p') && fileName.toLowerCase().includes('webdl')) {
                        capQty = '540P WEBDL'
                        extraParams = '540p_WEBDL'
                    }

                    else if (fileName.toLowerCase().includes('.540p.nk.')) {
                        capQty = '540P HDTV H.265'
                        muxed = '#English Hard-subbed'
                        extraParams = 'NK'
                    }

                    else if (fileName.toLowerCase().includes('.540p.nn.')) {
                        capQty = '540P HDTV H.265'
                        muxed = 'RAW'
                        extraParams = 'NN='
                    }

                    else if (fileName.toLowerCase().includes('.480p.nk.')) {
                        capQty = '480P HDTV H.265'
                        muxed = '#English Hard-subbed'
                        extraParams = 'SOJU'
                    }

                    else if (fileName.toLowerCase().includes('.720p.webdl.')) {
                        capQty = '720P WEB-DL H.264'
                        muxed = '#English Soft-subbed'
                        extraParams = '720p_WEBDL'
                    }

                    else if (fileName.toLowerCase().includes('.360p.nk.')) {
                        capQty = '360P HDTV H.264'
                        muxed = '#English Hard-subbed'
                        extraParams = 'KIMOI'
                    }

                    let cap = `<b>Ep. ${noEp} | ${capQty}  \n${muxed}\n\n⭐️ Find More K-Dramas at\n<a href="https://t.me/+vfhmLVXO7pIzZThk">@KOREAN_DRAMA_STORE</a></b>`
                    if (muxed == '#English Soft-subbed') {
                        cap = `<b>Ep. ${noEp} | ${capQty}  \n${muxed}</b>\n\n<i>- This ep. is soft-subbed, use VLC or MX Player to see subtitles</i>`
                    }

                    if (extraParams == 'NN=') {
                        cap = `<b>Ep. ${noEp} | ${capQty}  \n${muxed}</b>\n\n<i>- This episode has no subtitle. While playing add the subtitle file below.</i>`
                    }

                    await bot.api.editMessageCaption(ctx.channelPost.chat.id, msgId, {
                        caption: cap, parse_mode: 'HTML'
                    })

                    ctx.reply(`Copy -> <code>uploading_new_episode_${noEp}_S${netSize}_msgId${msgId}_${extraParams}</code>`, { parse_mode: 'HTML' })
                }
            }

            // if is other channels
            else {
                //check if its text sent to that channel
                if (ctx.channelPost.hasOwnProperty('text')) {
                    let txt = ctx.channelPost.text
                    if (txt.includes('uploading_new_episode')) {
                        // uploading new episode
                        UploadingNewEpisode(ctx, txt, dt, bot)
                    }

                    else if (txt.includes('post_drama')) {
                        // from mydramalist
                        //scrapeMyDramalist(ctx, txt, dt, bot)

                        // from asianwiki
                        //scrapeAsianWiki(ctx, txt, dt, bot)
                    }

                    else if (txt.includes('post_db=')) {
                        TelegraphPage(ctx)
                    }

                    else if (txt.includes('update_id')) {
                        let chan_id = ctx.channelPost.chat.id
                        let cname = ctx.channelPost.chat.title
                        let invite = await ctx.api.createChatInviteLink(chan_id)
                        let tgChannel = `tg://join?invite=${invite.invite_link.split('/+')[1]}`

                        if (cname.includes('Official -')) {
                            cname = cname.split('Official - ')[1]
                        } else if (!cname.includes('Official -') && cname.includes('[Eng sub]')) {
                            cname = cname.split('[Eng sub] ')[1].trim()
                        }

                        let up = await vueNewDramaModel.findOneAndUpdate({ newDramaName: cname }, { $set: { chan_id, tgChannel } }, { new: true })
                        let did = await ctx.reply(`drama updated with ${up.chan_id} and ${tgChannel} as link`)
                        await delay(500)
                        await ctx.api.deleteMessage(ctx.chat.id, ctx.channelPost.message_id)
                        await ctx.api.deleteMessage(ctx.chat.id, did.message_id)
                    }
                    else if (txt.includes('zima updates')) {
                        let chan_id = ctx.channelPost.chat.id

                        let up = await vueNewDramaModel.findOneAndUpdate({ chan_id }, { $set: { notify: false } }, { new: true })
                        let did = await ctx.reply(`Backup notifications turned off`)
                        await delay(500)
                        await ctx.api.deleteMessage()
                        await ctx.api.deleteMessage(ctx.chat.id, did.message_id)
                    }
                    else if (txt.includes('washa updates')) {
                        let chan_id = ctx.channelPost.chat.id

                        let up = await vueNewDramaModel.findOneAndUpdate({ chan_id }, { $set: { notify: true } }, { new: true })
                        let did = await ctx.reply(`Backup notifications turned on`)
                        await delay(500)
                        await ctx.api.deleteMessage()
                        await ctx.api.deleteMessage(ctx.chat.id, did.message_id)
                    }
                }
            }
        }

        // if is not channel
        else { next() }
    }
    catch (err) {
        console.log(err)
        anyErr(err)
    }

}