const express = require('express');
const mongoose= require('mongoose');
const http = require('http');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const Chat = require('./models/chat');
const chartRouter = require('./routes/chart');
const morgan = require('morgan');
const morgandebug = require('morgan-debug');
require('dotenv').config();
const DB = "mongodb+srv://hqminh050503:minh0505@cluster0.us3cipj.mongodb.net/?retryWrites=true&w=majority";;
const cors = require("cors");


//process.env.DBB;
//"mongodb+srv://hqminh050503:minh0505@cluster0.us3cipj.mongodb.net/?retryWrites=true&w=majority";
const PORT = 3000;
const PORTSERVER = 4000;

// app
const app = express();
// other files
var server = http.createServer(app);
var io = require("socket.io")(server);


// middleware client->middleware->server->client
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));
app.use(morgandebug('server:server', 'dev'));
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);
app.use(productRouter);
app.use(chatRouter);
app.use(chartRouter);

// socket io
io.on("connection", (socket) => {
  console.log(`a ${socket.id} connected`);
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });

  socket.on("createRoomChat", async ({ user, message, time, id }) => {
    const userData = JSON.parse(user);
    try {
      const chatId = getConversationID(id, userData.id);
      let chat = await Chat.findOne({ id: chatId });

      if (chat) {
        // Chat exists, add the message to the existing chat
        const mess = {
          toId: userData.id,
          msg: message,
          sent: time,
          fromId: id,
        };
       
        chat.chats.push(mess);
        await chat.save();
        io.sockets.emit("createRoomChatSuccess", message);
      } else {
        // Chat doesn't exist, create a new chat
        const chatMess = new Chat({
          id: chatId,
          chats: [
            {
              toId: userData.id,
              msg: message,
              sent: time,
              fromId: id,
            },
          ],
        });
        await chatMess.save();
        io.sockets.emit("createRoomChatSuccess", message);
      }

      //socket.join(chatId);
     
      console.log('createRoomChatSuccess');
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('startRoomChat', async({user, id})=>{
    const userData = JSON.parse(user);
    console.log("toID:" + userData.id);
    console.log("fromID:" + id);
    try{
      const chatId = getConversationID(id, userData.id);
      let chat = await Chat.findOne({id: chatId});
    if(chat){
      const chatJSON = JSON.stringify(chat);

      // Gửi dữ liệu dưới dạng JSON đến client
      io.sockets.emit('go', chatJSON);
       console.log(chat);
    }else{
      console.log('start room chat false ');
    }
    }catch(e){
      console.log(e);
    }

  });

});
function getConversationID(id1, id2) {
  // Xác định chatId dựa trên hai ID người dùng
  const smallerID = id1 <= id2 ? id1 : id2;
  const largerID = id1 <= id2 ? id2 : id1;
  return `${smallerID}_${largerID}`;
}


// connnect MongGo DB
mongoose.connect(DB).then(() => {
 console.log('Connnect Mongo Success');
}).catch((e)=>{
  console.log(e);
});

// lisetren port
app.listen(PORT,"0.0.0.0",() =>{
   console.log(`connnect at port: ${PORT}`);
});


server.listen(PORTSERVER, "0.0.0.0", () => {
  console.log(`Server started and running on port ${PORTSERVER}`);
});