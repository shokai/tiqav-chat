
var socket = io.connect();

var create_chat_html = function(msg){
    var chat = $('<div>');

    if(msg.user.match(/^[a-zA-Z0-9_]+$/)){
        chat.append( $('<span>').addClass('icon').html(
            $('<img>').attr('src', 'http://twiticon.herokuapp.com/'+msg.user)
        ) );
    }
    chat.append( $('<span>').addClass('user').text(msg.user) );
    chat.append(' : ');
    chat.append( $('<span>').addClass('body').text(msg.body) );
    return chat;
};

$(function(){
    $('#btn_send').click(function(e){
        var msg = {body: $('#body').val(), user: $('#user').val()};
        socket.emit('post', msg);
    });

    socket.on('posted', function(data){
        var li = $('<li>').html(create_chat_html(data.message));
        $('#chat').prepend(li);
    });

    socket.on('connected', function(data){
        for(var i = 0; i < data.message.length; i++){
            var msg = data.message[i];
            var li = $('<li>').html(create_chat_html(msg));
            $('#chat').prepend(li);
        }
    });
});
