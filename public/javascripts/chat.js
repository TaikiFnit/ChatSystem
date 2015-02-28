var socket = io.connect();

socket.on('receive', function (data) {
  $("div#chat-area").prepend("<div>" + data.name + " : " + data.message +  "</div>");
});

socket.on('all_receive', function (data){

  for(var i = 0; i < data.length; i++){
  $("div#chat-area").prepend("<div>" + data[i].name + " : " + data[i].message +  "</div>");
  }
});

function send() {
  var name = $("input#name").val();
  var msg = $("input#message").val();
  $("input#message").val("");
  socket.emit('send', { name: name, message: msg });
}
