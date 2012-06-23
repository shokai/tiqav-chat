
var socket = io.connect('http://localhost:3000');

$(function(){
    $('#btn_send').click(function(e){
        console.log('click!!');
        var msg = {body: $('#body').val(), user: $('#user').val()};
        socket.emit('post', msg)
    });

    socket.on('posted', function(data){
        var li = $('<li>').text(data.message.user + ' : ' + data.message.body);
        $('#chat').prepend(li);
    });
});
