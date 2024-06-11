const Message = require('../models/Message');
const roomGenerator = require('../util/roomIdGenerator.js');
const moment = require('moment');
const sanitize = require('mongo-sanitize');

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
    nickname: sanitize(request.body.nickname),
    body: sanitize(request.body.body),
    timestamp: moment().toDate() 
  });
    await newMessage.save();
}

//edit delete and search
async function editMessage(request, response) {
  const { roomId, messageId } = request.params;
  const { body } = sanitize(request.body);

  const updatedMessage = await Message.findByIdAndUpdate(
    messageId,
    { body, edited: true },
    { new: true }
  );

  if (updatedMessage) {
    response.json(updatedMessage);
  } else {
    response.status(404).json({ error: 'Message not found' });
  }
}

async function deleteMessage(request, response) {
  const { roomId, messageId } = request.params;

  const deletedMessage = await Message.findByIdAndDelete(messageId);

  if (deletedMessage) {
    response.json({ success: true });
  } else {
    response.status(404).json({ error: 'Message not found' });
  }
}

async function searchMessages(request, response) {
  const roomName = request.params.roomName;
  const query = sanitize(request.query.query);

  try {
    //find messages
    const searchResults = await Message.find({
      roomId: roomName,
      body: new RegExp(query, 'i')
    });

    response.json(searchResults);
  } catch (error) {
    response.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getRoom,
  getMessages,
  postMessage,
  editMessage,
  deleteMessage,
  searchMessages
};