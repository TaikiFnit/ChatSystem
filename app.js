var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io');
var mysql = require('mysql');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').createServer(app);
var io = io.listen(server);


// connect mysql data base 
var connection = mysql.createConnection({
	host: process.env.DB_HOST || 'localhost',
	user : 'mod1_user',
	password: process.env.DB_PASS || 'IRC2015',
	database: process.env.DB_NAME || 'mod1_DB'
});

var connect_message = {
	"name" : "NodejsServer",
	"message" : "Success Connection"
};

connection.query('select * from messages', function(err, rows){
	console.log(rows);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server.listen(3000);
console.log('server is listening');

// クライアントとの接続が確立
io.sockets.on('connection', function(socket) {
	console.log('Event connection');
	
	// クライアントに接続完了のメッセージを送る
	socket.emit('receive', connect_message);
	connection.query('select * from messages', function(err, rows){
		console.log('Emit bellow');
		console.log(rows);
		socket.emit('all_receive', rows);	
	});

	socket.on('send', function(data) {
		console.log('Event: message:send');
		console.log(data);
		connection.query('insert into messages(name, message) values(?, ?)', [data.name, data.message]);

		io.sockets.emit('receive', { name: data.name, message: data.message });
	});
});

module.exports = app;
