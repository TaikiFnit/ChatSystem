var socket = io.connect();

// 初回接続時に発生するイベントのハンドラー
socket.on('connect_message', function (data) {
    var msg = "<div id='alert' class='alert alert-info'>\
<button class='close' data-dismiss='alert'>&times;</button>" + data.name + " : " + data.message + "</div>";
  $("div#chat-area").prepend(msg);
});

// コメント受信時に発生するイベントのハンドラー
socket.on('receive', function (data) {
  var element = "<form class='rows' data-id='" + data.id + "'>\
        <div class='form-group'>\
        <div>" + data.name + " : " + data.message +  "</div>\
        </div>\
        <div class='form-group'>\
        <button type='button' data-id='" + data.id + "' class='btn btn-warning' onclick='message_delete(this.dataset.id)'>Delete</button>\
        </div>\
        </form>";
      
  $("div#chat-area").prepend(element);
});

// 初回接続時にDBに格納されているデータを受け取るイベントのハンドラー
socket.on('init_receive', function (data){
  for (var i = 0; i < data.length; i++){
        var element = "<form class='rows' data-id='" + data[i].id + "'>\
        <div class='form-group'>\
        <div>" + data[i].name + " : " + data[i].message +  "</div>\
        </div>\
        <div class='form-group'>\
        <button type='button' data-id='" + data[i].id + "' class='btn btn-warning' onclick='message_delete(this.dataset.id)'>Delete</button>\
        </div>\
        </form>";
      
        $("div#chat-area").prepend(element);
  }
});

// コメントを削除するイベントのハンドラー
socket.on('ClDelete', function(data){
  $("form[data-id='" + data.id + "']").remove();		
});

socket.on('truncate', function(data){
  $("div#chat-area").empty(); 
});

// コメントをサーバに送信する関数
function Send() {
  var name = $("input#name").val();
  var msg = $("input#message").val();
  $("input#message").val("");
  socket.emit('send', { name: name, message: msg });
}

// コメントの削除要請をする関数
function message_delete(arg_id){
  socket.emit("SeDelete", {id: arg_id});
}

function trunCate(){
  socket.emit('truncate');
}