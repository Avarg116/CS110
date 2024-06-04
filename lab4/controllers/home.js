
const roomGenerator = require('../util/roomIdGenerator.js');
const Chatroom = require('../models/Chatroom');

async function getHome(request, response) {
  const rooms = await Chatroom.find({});
  response.render('home', { title: 'home', rooms });
}

async function createRoom(request, response) {
  const roomName = request.body.roomName || roomGenerator.roomIdGenerator();
  const roomId = roomGenerator.roomIdGenerator();

 
  const newRoom = new Chatroom({ name: roomName, roomId: roomId });
  await newRoom.save();
  response.redirect(`/${roomId}`);
}

module.exports = {
  getHome,
  createRoom
};
