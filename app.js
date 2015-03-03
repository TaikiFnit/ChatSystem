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

// Catch data from Database and output console
connection.query('select * from messages', function(err, results, fields){
	console.log('---results---');
	console.log(results);
	console.log('---result end---');
	console.log('---fields---');
	console.log(fields);
	console.log('---fields end---');
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

//--- Error Handlers ---//

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

//--- End Error Handlers ---//

// listen server
server.listen(3000);
console.log('server is listening');

//--- Socket.IO ---//

// クライアントとの接続が確立
io.sockets.on('connection', function(socket) {
	console.log('Event: connection');
	
	console.log('Emit: receive');
	// クライアントに接続完了のメッセージを送る
	socket.emit('receive', connect_message);

	// DBに格納されているすべてのデータを抽出し、それをクライアントに送る
	connection.query('select * from messages', function(err, results){
		// DBから取ってきたデータをコンソールに出力
		console.log('Emit: bellow data');
		console.log(results);
		console.log('--- data end ---');
		console.log('Emit: all_receive');
		socket.emit('all_receive', results);	
	});

	// クライアントからメッセージが送られてきたときのイベント
	socket.on('send', function(data) {
		//　送られてきたデータをコンソールに出力
		console.log('Event: send');
		console.log(data);
		
		// 送られてきたデータをDBに挿入
		connection.query('insert into messages(name, message) values(?, ?)', [data.name, data.message], function(err, results){
			// SQL文を送った結果をコンソールに出力
			console.log('--- insert result ---');
			console.log(results);
			console.log('--- insert result end ---');
		});

		// 送られてきたデータ(メッセージ)をすべてのクライアントに送る
		console.log('Emit: receive');	
		io.sockets.emit('receive', { name: data.name, message: data.message });
	});

	// 送られてきたidのメッセージをDBから削除するイベント
	socket.on('SeDelete', function(data) {
		console.log('Event: SeDelete');
		connection.query('delete from messages where id = ?', [data.id], function(err, results){
			// DBからdeleteした結果を出力
			console.log('--- delete results ---');
			console.log(results);
			console.log('--- delete results end---');
			
			// クライアントにdeleteを要求
			io.sockets.emit('ClDelete', {id: data.id});
		});
	});
			
});

//--- End Socket.IO ---//

module.exports = app;
