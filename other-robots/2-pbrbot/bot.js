const PBRBotFunction = async () => {
    const axios = require('axios').default
    const { Bot } = require("grammy");

    const bot = new Bot(process.env.PBR_TOKEN);

    const imp = {
        shemdoe: 741815228,
        pricelogs: -1002137014810,
        kucoin: `https://www.kucoin.com/r/af/rJ4G8KG`,
    }

    const affButtons =  [
        [
            {text: `💳 BUY`, url: imp.kucoin},
            {text: `📈 TRADE`, url: imp.kucoin}
        ]
    ]

    const API = `https://api.coincap.io/v2/assets/polkabridge`

    bot.command('start', async ctx => {
        try {
            let txt = `Hi <b>${ctx.chat.first_name}</b>\n\nTo get the live price of <b>PolkaBridge (PBR)</b> use these command <b>/pbr</b> or <b>/price</b>`
            await ctx.reply(txt, {parse_mode: 'HTML'})
        } catch (error) {
            console.log(error.message, error)
        }
    })

    bot.command(['price', 'pbr'], async ctx=> {
        try {
            let userid = ctx.chat.id
            let fname = ctx.chat.first_name
            let username = ctx.chat.username ? `<b>@${ctx.chat.username}</b>` : `<b><a href="tg://user?id=${userid}">${fname}</a></b>`

            //make request
            let res = await axios.get(API)
            let timestamp = res.data.timestamp
            let time = new Date(timestamp).toUTCString()
            let id = res.data.data.id
            let rank = res.data.data.rank
            let symbol = res.data.data.symbol
            let name = `${res.data.data.name} (${symbol})`
            let supply = res.data.data.supply
            let mcap = Number(res.data.data.marketCapUsd).toLocaleString('en-US', {style: 'currency', currency: 'USD'})
            let vol = Number(res.data.data.volumeUsd24Hr).toLocaleString('en-US', {style: 'currency', currency: 'USD'})
            let price = Number(res.data.data.priceUsd).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 6})
            let change24 = Number(res.data.data.changePercent24Hr).toFixed(2)
            let txt = `<b>${name} Price as of ${time}</b>\n\n<b>📊 Rank: </b>${rank}\n<b>💰 Price: </b>${price}\n<b>📈 MktCap: </b>${mcap}\n<b>⏳ 24hr changes: </b>${change24}%\n<b>🕧 24hr Volume: </b>${vol}\n\nBuy ${name} and Make your trades with 0 fee`
            await ctx.reply(txt, {parse_mode: 'HTML', reply_markup: {
                inline_keyboard: affButtons
            }})
            await ctx.api.sendMessage(imp.pricelogs, `${username} just checked price of ${name}`, {parse_mode: 'HTML'})
        } catch (err) {
            console.log(err.message, err)
            await ctx.reply(`Oops! We seems to have a proble fetching the price. Please retry after few minute.`)
            await ctx.api.sendMessage(imp.pricelogs, err.message)
        }
    })

    // Start the bot (using long polling)
    bot.start().catch(e=> console.log(e.message))
}

module.exports = {PBRBotFunction}