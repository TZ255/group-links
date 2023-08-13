const express = require('express')
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const app = express()

const getRoutes = require('./routes/get')
const bots = require('./bots/bot')


// database connection
mongoose.connect(`mongodb://${process.env.USER}:${process.env.PASS}@nodetuts-shard-00-00.ngo9k.mongodb.net:27017,nodetuts-shard-00-01.ngo9k.mongodb.net:27017,nodetuts-shard-00-02.ngo9k.mongodb.net:27017/bongo-p1?authSource=admin&replicaSet=atlas-pyxyme-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`)
    .then(() => console.log('Connected to P1 DB'))
    .catch((err) => {
        console.log(err)
    })

// middlewares
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(cors())
app.set('trust proxy', true)
app.use(getRoutes)
if (process.env.ENVIRONMENT == 'production') {
    bots.myBotsFn()
}

app.listen(process.env.PORT || 3000, () => console.log('Listen to port 3000'))