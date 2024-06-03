const Message = require('../models/Message');
const roomGenerator = require('../util/roomIdGenerator.js');
const moment = require('moment');

async function getRoom(request, response) {
  const roomName = request.params.roomName;
  response.render('room', { title: 'chatroom', roomName: roomName, newRoomId: roomGenerator.roomIdGenerator() });
}

async function getMessages(request, response) {
  const roomName = request.params.roomName;

    const roomMessages = await Message.find({ roomId: roomName }).sort({ timestamp: 1 });
    response.json(roomMessages);
  
}

async function postMessage(request, response) {
  const roomName = request.params.roomName;
  const newMessage = new Message({
    roomId: roomName,
    nickname: request.body.nickname,
    body: request.body.body,
    timestamp: moment().toDate() 
  });
    await newMessage.save();

}

module.exports = {
  getRoom,
  getMessages,
  postMessage
};
