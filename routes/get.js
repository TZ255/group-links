const express = require('express')
const router = express.Router()

//groups
const ngono_tg = require('../jsons/telegram/ngono.json')
const ngono_tsap = require('../jsons/whatsapp/ngono.json')
const malaya_tg = require('../jsons/telegram/malaya.json')
const malaya_tsap = require('../jsons/whatsapp/malaya.json')
const michezo_tsap = require('../jsons/michezo/tsap.json')
const michezo_tg = require('../jsons/michezo/tg.json')

//dramastore
const episodesModel = require('../bots/2-Dramastore/models/vue-new-episode')

router.get('/', async (req, res) => {
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

router.get('/telegram', async (req, res) => {
    try {
        res.render('2groups/Telegram/tg', { ngono_tg, malaya_tg })
    } catch (err) {
        console.log(err.message)
    }
})

router.get('/whatsapp', async (req, res) => {
    try {
        res.render('2groups/WhatsApp/tsap', { ngono_tsap, malaya_tsap })
    } catch (err) {
        console.log(err.message)
    }
})

router.get('/michezo', async (req, res) => {
    try {
        res.render('2groups/Michezo/michezo', { michezo_tg, michezo_tsap })
    } catch (err) {
        console.log(err.message)
    }
})

router.get('/connection/:msanii', async (req, res, next) => {
    try {
        let msanii = req.params.msanii
        let aslay_db = require('../jsons/connection/aslay.json')
        let haji_db = require('../jsons/connection/haji.json')
        let uwoya_db = require('../jsons/connection/uwoya.json')
        let mchungaji_db = require('../jsons/connection/mchungaji.json')

        switch (msanii) {
            case 'aslay':
                res.render('3connections/Aslay/aslay', { aslay_db })
                break;
            case 'manara':
                res.render('3connections/Haji/haji', { haji_db })
                break;
            case 'uwoya':
                res.render('3connections/Uwoya/uwoya', { uwoya_db })
                break;
            case "mtoto-wa-mchungaji":
                return res.render('3connections/Mtoto-wa-mchungaji/index', { mchungaji_db })

            default:
                next()
        }

    } catch (err) {
        console.log(err.message)
    }
})

router.get('/tg/join/channel/:alias', async (req, res) => {
    try {
        res.set('X-Robots-Tag', 'noindex, nofollow');
        res.redirect(302, 'https://telegram.me/+y3T6eyZwEQk3NzU8')
    } catch (err) {
        console.log(err.message)
    }
})

router.get('*', (req, res) => {
    res.status(404).send(`Link hii haipo. Rudi kwenye tovuti kuu kwa kubonyeza <a href="/">HAPA</a>`)
})

module.exports = router