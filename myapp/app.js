
var createError = require('http-errors');
const cors = require("cors");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
var logger = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

require("dotenv").config();

var indexRouter = require('./routes/index');
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const wishlistRoute = require("./routes/wishlistRoute");

var app = express();

app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use("/products", productRoute);
app.use("/cart", cartRoute);
app.use("/wishlist", wishlistRoute);

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log(error));

// 404 Error Handler
app.use(function(req, res, next) {
    next(createError(404));
});

// Error Handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

// HTTP Server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

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

// Start Server
server.listen(5000, () => {
    console.log("Server running on port 5000");
});
