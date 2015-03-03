var socket = io.connect();

socket.on('receive', function (data) {
  $("div#chat-area").prepend("<div data-id='" + data.id + "'>" + data.name + " : " + data.message +  "</div>");
  $("div#chat-area").prepend("<button type='button' data-id='" + data.id + "' onclick='message_delete(this.dataset.id)'>Delete</button>");
});

socket.on('init_receive', function (data){
  for(var i = 0; i < data.length; i++){
  $("div#chat-area").prepend("<div data-id='" + data[i].id + "'>" + data[i].name + " : " + data[i].message +  "</div>");
  $("div#chat-area").prepend("<button type='button' data-id='" + data[i].id + "' onclick='message_delete(this.dataset.id)'>Delete</button>");
  }
});

socket.on('ClDelete', function(data){
  $("div[data-id='" + data.id + "']").remove();		
  $("button[data-id='" + data.id + "']").remove();
});

function message_delete(arg_id){
  socket.emit("SeDelete", {id: arg_id});
}

function send() {
  var name = $("input#name").val();
  var msg = $("input#message").val();
  $("input#message").val("");
  socket.emit('send', { name: name, message: msg });
}
