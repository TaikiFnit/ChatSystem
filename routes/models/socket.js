//--- Socket.IO ---//

function socketio(server){

// connect mysql
var mysql = require('mysql');

// connect mysql data base 
var connection = mysql.createConnection({
	host: process.env.DB_HOST || 'localhost',
	user : 'mod1_user',
	password: process.env.DB_PASS || 'IRC2015',
	database: process.env.DB_NAME || 'mod1_DB'
});

// Catch data from Database and output console
connection.query('select * from messages', function(err, results, fields){
	console.log('---results---');
	console.log(results);
	console.log('---result end---');
	console.log('---fields---');
	console.log(fields);
	console.log('---fields end---');
});

var connect_message = {
	"name" : "NodejsServer",
	"message" : "Success Connection"
};

//--- end mysql connect ---//

io = require('socket.io')(server);

// クライアントとの接続が確立
io.sockets.on('connection', function(socket) {

	// クライアントに接続完了のメッセージを送る
	console.log('Emit: connect_message');
	socket.emit('connect_message', connect_message);

	// DBに格納されているすべてのデータを抽出し、それをクライアントに送る
	connection.query('select * from messages', function(err, results){
		// DBから取ってきたデータをコンソールに出力
		console.log('Emit: bellow data');
		console.log(results);
		console.log('--- data end ---');
		// クライアントにデータを送信
		console.log('Emit: all_receive');
		socket.emit('init_receive', results);	
	});

	// クライアントからメッセージが送られてきたときのイベント
	socket.on('send', function(data) {
		//　送られてきたデータをコンソールに出力
		console.log('Event: send');
		console.log(data);
		console.log('---sended data end---')
		
		// 送られてきたデータをDBに挿入
		connection.query('insert into messages(name, message) values(?, ?)', [data.name, data.message], function(err, results){
			// SQL文を送った結果をコンソールに出力
			console.log('--- insert result ---');
			console.log(results);
			console.log('--- insert result end ---');
	
			// 送られてきたデータ(メッセージ)をすべてのクライアントに送る
			console.log('Emit: receive');	
			io.sockets.emit('receive', { id: results.insertId, name: data.name, message: data.message });
		});

	});

	// 送られてきたidのメッセージをDBから削除するイベント
	socket.on('SeDelete', function(data) {
		// 送られてきたデータをコンソールに出力
		console.log('Event: SeDelete');
		console.log('output data from cliant');
		console.log(data);
		console.log('---data end---')

		// 送られてきたidのコメントをDBから削除する
		connection.query('delete from messages where id = ?', [data.id], function(err, results){
			// DBからdeleteした結果を出力
			console.log('--- delete results ---');
			console.log(results);
			console.log('--- delete results end ---');
			
			// クライアントにdeleteを要求
			io.sockets.emit('ClDelete', {id: data.id});
		});
	});

	// DBに格納されているすべてのデータを削除する	
	socket.on('truncate', function(data) {
		// truncateイベント発生
		console.log('Event: truncate');

		// DBのmessagesテーブルに格納されているすべてのデータを削除するSQL文
		connection.query('truncate table messages', function(err, results){
			// DBからturncateした結果を出力
			console.log('--- truncate results ---');
			console.log(results);
			console.log('--- truncate results end ---');

			// クライアントにdelete要求
			io.sockets.emit('truncate');
		});
	});	
});

});

module.exports = socketio;

//--- End Socket.IO ---//
