
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes');

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);
io.configure(function(){
    io.set('transports', ['xhr-polling']);
    io.set('polling duration', 10);
});

var chat_logs = new (function(){
    this.logs = new Array();
    var self = this;

    this.all = function(){
        return self.logs;
    };

    this.push = function(data){
        self.logs.push(data);
        while(self.logs.length > self.max_log_size) self.logs.shift();
    };

    this.max_log_size = 100;
    this.max = function(size){
        self.max_log_size = size;
        return self;
    };
})();


// Configuration

app.configure(function(){
  if(process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASS){
    app.use(express.basicAuth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASS));
  }
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  chat_logs.max(100);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

io.sockets.on('connection', function(socket){
    socket.emit('connected', {
        message : chat_logs.all()
    });

    socket.on('post', function(data){
        chat_logs.push(data);
        io.sockets.emit('posted', {
            message : data
        }); // echo all clients
    });
});

app.listen(process.env.PORT || 5000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
