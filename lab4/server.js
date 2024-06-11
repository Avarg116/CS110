
const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
var sanitize = require('mongo-sanitize'); 

const mongoDB_ConnectionString = 'mongodb+srv://avarg116:UCR04567@cluster0.18wd19h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoDB_ConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Could not connect to MongoDB:', error));

const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Stylesheet routes
app.use(express.static(path.join(__dirname, "public")));

const checkAuth = (req, res, next) => {
  if (req.cookies.__session) {
    next();
  } else {
    res.redirect('/login');
  }
};

// This is to sanitize parameters in all routes 
const sanitizeInput = (req, res, next) => {
  req.params = sanitize(req.params);
  next();
};

// Routes login and registration
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});
app.get('/logout', (req, res) => {
  res.clearCookie('__session');
  res.redirect('/login');
});

//Routes for home and chat rooms
app.get('/', checkAuth, homeHandler.getHome);
app.post('/create', checkAuth, homeHandler.createRoom);
app.get('/:roomName', checkAuth, roomHandler.getRoom);
app.get('/:roomName/messages', checkAuth, roomHandler.getMessages);
app.post('/:roomName/messages', checkAuth, roomHandler.postMessage);
app.put('/:roomName/messages/:messageId', checkAuth, roomHandler.editMessage);
app.delete('/:roomName/messages/:messageId', checkAuth, roomHandler.deleteMessage);
app.get('/:roomName/search', checkAuth, roomHandler.searchMessages);

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));