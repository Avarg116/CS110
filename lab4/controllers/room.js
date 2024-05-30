const roomGenerator = require('../util/roomIdGenerator.js');
const moment = require('moment');

const messages = {};

function getRoom(request, response) {
  const roomName = request.params.roomName;
  if (!messages[roomName]) {
    messages[roomName] = [];
  }
  response.render('room', { title: 'chatroom', roomName: roomName, newRoomId: roomGenerator.roomIdGenerator() });
}

function getMessages(request, response) {
  const roomName = request.params.roomName;
  response.json(messages[roomName] || []);
}

function postMessage(request, response) {
  const roomName = request.params.roomName;
  const newMessage = {
    nickname: request.body.nickname,
    body: request.body.body,
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
  };
  if (!messages[roomName]) {
    messages[roomName] = [];
  }
  messages[roomName].push(newMessage);
  response.json({ status: 'success' });
}

module.exports = {
  getRoom,
  getMessages,
  postMessage
};
