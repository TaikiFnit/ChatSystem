var socket = io.connect();

// 初回接続時に発生するイベントのハンドラー
socket.on('connect_message', function(data) {
  $("div#chat-area").prepend("<div>" + data.name + " : " + data.message +  "</div>");
});

// コメント受信時に発生するイベントのハンドラー
socket.on('receive', function (data) {
  $("div#chat-area").prepend("<button type='button' data-id='" + data.id + "' onclick='message_delete(this.dataset.id)'>Delete</button>");
  $("div#chat-area").prepend("<div data-id='" + data.id + "'>" + data.name + " : " + data.message +  "</div>");
});

// 初回接続時にDBに格納されているデータを受け取るイベントのハンドラー
socket.on('init_receive', function (data){
  for(var i = 0; i < data.length; i++){
  $("div#chat-area").prepend("<button type='button' data-id='" + data[i].id + "' onclick='message_delete(this.dataset.id)'>Delete</button>");
  $("div#chat-area").prepend("<div data-id='" + data[i].id + "'>" + data[i].name + " : " + data[i].message +  "</div>");
  }
});

// コメントを削除するイベントのハンドラー
socket.on('ClDelete', function(data){
  $("div[data-id='" + data.id + "']").remove();		
  $("button[data-id='" + data.id + "']").remove();
});

socket.on('truncate', function(data){
  $("div#chat-area").empty(); 
});

// コメントをサーバに送信する関数
function send() {
  var name = $("input#name").val();
  var msg = $("input#message").val();
  $("input#message").val("");
  socket.emit('send', { name: name, message: msg });
}

// コメントの削除要請をする関数
function message_delete(arg_id){
  socket.emit("SeDelete", {id: arg_id});
}

function truncate(){
  socket.emit('truncate');
}


