const mongoose = require('mongoose');
const {messSchema} = require('./message');

const chatSchema = mongoose.Schema({
    id:{
        type: String,
        default: '',
    },
    chats : [messSchema],
});

const Chat = mongoose.model('Chat',chatSchema);
module.exports = Chat;