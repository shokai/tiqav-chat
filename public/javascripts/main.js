
var socket = io.connect();

$(function(){
    $('#btn_send').click(function(e){
        var msg = {body: $('#body').val(), user: $('#user').val()};
        socket.emit('post', msg);
    });

    socket.on('posted', function(data){
        var li = $('<li>').text(data.message.user + ' : ' + data.message.body);
        $('#chat').prepend(li);
    });

    socket.on('connected', function(data){
        for(var i = 0; i < data.message.length; i++){
            var c = data.message[i];
            var li = $('<li>').text(c.user + ' : ' + c.body);
            $('#chat').prepend(li);
        }
    });
});
