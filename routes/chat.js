const express = require('express');
const User = require('../models/user');
const auth = require('../middlewares/auth');
const Chat = require('../models/chat');
const { Message } = require('../models/message');
const chatRouter = express.Router();

chatRouter.get('/api/chat/users',auth, async(req, res) => {
    try {
        const chat = await User.find({});
        res.json(chat);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

chatRouter.get('/api/chat/messages/:id',auth, async(req, res) => {
    try {
        const {id} = req.params;
        const chat = await Chat.findOne({ id: id});
        res.json(chat);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

function getConversationID(id1, id2) {
    // Xác định chatId dựa trên hai ID người dùng
    const smallerID = id1 <= id2 ? id1 : id2;
    const largerID = id1 <= id2 ? id2 : id1;
    return `${smallerID}_${largerID}`;
}

chatRouter.put('/api/chat/messages/update',auth ,async(req,res)=>{
   try{
      const {chatId, sent , msg} = req.body;
      console.log("update read: " + chatId);
      let chat = await Chat.findOne({ id: chatId});
      if(chat){
         const message = chat.chats.find((msg) => msg.sent === sent);
        if(message){
            console.log(message);
            message.msg = msg;

            await chat.save();
        }
        else {
            console.log('Message with sent timestamp not found');
          }
      }
      else {
        console.log('Chat not found');
      } 

    res.json({ message: 'Message read updated successfully'});
   }catch(e){
    res.status(500).json({ error: e.message });
   }
});

chatRouter.delete('/api/chat/message/delete', async(req, res)=>{
   try{
     const {chatId, sent} = req.body;
     let chat = await Chat.findOne({id: chatId});
     if(chat){
       let messageIndex = chat.chats.findIndex((msg) => msg.sent === sent);
       if (messageIndex !== -1) {
        chat.chats.splice(messageIndex, 1);
        await chat.save();
        res.json(chat.chats[messageIndex]); // Respond with the deleted message
      } else {
        console.log('Message to delete not found');
      }
     } else{
        console.log('chat delete not found');
     }

   }catch(e){
    res.status(500).json({ error: e.message });
   }
});
  
module.exports = chatRouter;