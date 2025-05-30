const mongoose = require('mongoose')

const Schema = mongoose.Schema

const HomeSchema = new Schema({
    idToHome: {
        type: String,
        required: true
    },
    dramaName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    episodesUrl: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    }
}, { timestamps: true, strict: false },
)

const dramastore = mongoose.connection.useDb('dramastore')
const model = dramastore.model('home', HomeSchema)
module.exports = model