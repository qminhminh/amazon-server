const mongoose = require('mongoose');

const messSchema =new mongoose.Schema({
    toId: {
        type: String,
        required: true,
        default: '',
    },
    msg: {
        type: String,
        required: true,
        default: ''
    },
    sent: {
        type: String,
        default: '',
    },
    fromId: {
        type: String,
        required: true,
        default: '',
    },
    read: {
        type: String,
        default: '',
    },

});

const Message = mongoose.model('Message',messSchema);
module.exports = {Message,messSchema};