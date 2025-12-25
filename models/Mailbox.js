const {Schema, model} = require('mongoose')

const mailBoxShema = new Schema({
    owner: {
        type: String,
        required: true
    },
    size:{
        type: String,
    }
})

const Mailbox = model('Mailbox',mailBoxShema)

module.exports = Mailbox