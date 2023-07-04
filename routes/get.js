const express = require('express')
const router = express.Router()

//groups
const ngono_tg = require('../jsons/telegram/ngono.json')
const ngono_tsap = require('../jsons/whatsapp/ngono.json')
const malaya_tg = require('../jsons/telegram/malaya.json')
const malaya_tsap = require('../jsons/whatsapp/malaya.json')
const michezo_tsap = require('../jsons/michezo/tsap.json')
const michezo_tg = require('../jsons/michezo/tg.json')

router.get('/', async (req, res)=> {
    try {
        res.render('1home/home', {
            tg: `<i class="fa-brands fa-telegram"></i>`,
            tsap: `<i class="fa-brands fa-whatsapp"></i>`,
            grp: `<i class="fa-solid fa-comments"></i>`
        })
    } catch (err) {
        console.log(err.message)
    }
})

router.get('/telegram', async (req, res)=> {
    try {
        res.render('2groups/Telegram/tg', {ngono_tg, malaya_tg})
    } catch (err) {
        console.log(err.message)
    }
})

router.get('/whatsapp', async (req, res)=> {
    try {
        res.render('2groups/WhatsApp/tsap', {ngono_tsap, malaya_tsap})
    } catch (err) {
        console.log(err.message)
    }
})

router.get('/michezo', async (req, res)=> {
    try {
        res.render('2groups/Michezo/michezo', {michezo_tg, michezo_tsap})
    } catch (err) {
        console.log(err.message)
    }
})

router.get('/tg/join/channel/:alias', async (req, res)=> {
    try {
        res.redirect('https://t.me/+y3T6eyZwEQk3NzU8')
    } catch (err) {
        console.log(err.message)
    }
})

router.all('/*', (req, res)=> {
    res.status(401).send(`Link hii haipo. Rudi kwenye tovuti kuu kwa kubonyeza <a href="/">HAPA</a>`)
})

module.exports = router