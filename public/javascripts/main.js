
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
    chat.append( $('<span>').addClass('body').html(msg.body.markup()) );
    return chat;
};

var Tiqav = new function(){
    var self = this;

    this.cache = {};

    this.search = function(word){
        if(word === null || word === ''){
            $('#tiqav').html('');
            return;
        }
        if(self.cache[word] === undefined){
            $.getJSON("http://api.tiqav.com/search.json?q="+word+"&callback=?", function(res){
                self.cache[word] = res;
                self.on_search(res);
            });
        }
        else{
            self.on_search(self.cache[word]);
        }
    };

    this.on_search = function(data){
        $('#tiqav').html('');
        var max_images = data.length > 6 ? 6 : data.length;
        for(var index = 0; index <  max_images; index++){
            (function(){
                var i = data[index];
                var img_url = 'http://img.tiqav.com/'+i.id+'.th.'+i.ext;
                var img = $('<img>').
                    attr('src', img_url).
                    click(function(e){
                        $('#body').val(img_url).focus();
                        self.search(null);
                    });
                $('#tiqav').prepend($('<li>').html(img));
            })();
        }
    };
}();

var chat_post = function(e){
    var msg = {body: $('#body').val(), user: $('#user').val()};
    socket.emit('post', msg);
};

$(function(){
    var sid = null;
    $('#body').keyup(function(e){
        clearTimeout(sid);
        sid = setTimeout(function(){
            Tiqav.search($('#body').val());
        }, 300);
    });

    $('#body').keydown(function(e){
        if(e.keyCode === 13){
            chat_post();
        }
    });
    $('#btn_send').click(chat_post);

    socket.on('posted', function(data){
        $('#body').val('');
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
