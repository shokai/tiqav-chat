
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


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
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
    socket.on('post', function(data){
        io.sockets.emit('posted', {
            message : data
        }); // echo all clients
    });
});

app.listen(process.env.PORT || 5000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
