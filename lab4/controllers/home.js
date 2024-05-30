const roomGenerator = require('../util/roomIdGenerator.js');

const rooms = [];

function getHome(request, response) {
  response.render('home', { title: 'home', rooms: rooms });
}

function createRoom(request, response) {
  const roomName = request.body.roomName || roomGenerator.roomIdGenerator();
  const roomId = roomGenerator.roomIdGenerator();
  rooms.push({ id: roomId, name: roomName });
  response.redirect(`/${roomId}`);
}

module.exports = {
  getHome,
  createRoom
};
