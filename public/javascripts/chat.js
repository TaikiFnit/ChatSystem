var socket = io.connect();

socket.on('receive', function (data) {
  $("div#chat-area").prepend("<div data-num='" + data.id + "'>" + data.name + " : " + data.message +  "</div>");
  $("div#chat-area").prepend("<button type='button' data-num='" + data.id + "' onclick='message_delete()'>Delete</button>");
});

socket.on('all_receive', function (data){
  for(var i = 0; i < data.length; i++){
  $("div#chat-area").prepend("<div data-num='>" + data[i].id + "'>" + data[i].name + " : " + data[i].message +  "</div>");
  }
});

socket.on('SeDelete', function(data){
  $('div[data-num='+data.id+']').remove();		
});

function message_delete(){
}

function send() {
  var name = $("input#name").val();
  var msg = $("input#message").val();
  $("input#message").val("");
  socket.emit('send', { name: name, message: msg });
}
