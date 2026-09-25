var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
var logger = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const studentRouter = require("./routes/studentRoute");
var indexRouter = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use(express.json());


mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log(error));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



const server = http.createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {

  console.log('A user connected');

  socket.on('message', (message) => {
    console.log('Message:', message);
     socket.emit('reply', 'Server got your message: ' + message);
  });


  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });


});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});