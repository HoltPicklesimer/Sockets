const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');

app.use(express.json());                      // to support JSON-encoded bodies
app.use(express.urlencoded({extended:true})); // to support URL-encoded bodies

// Set up the static and views directories
app.use(express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, 'views'));

// Set the port
app.set('port', (process.env.PORT || 5000));

// start webserver on port 8080
var server =  http.createServer(app);
var io = socketIo.listen(server);
server.listen(app.get('port'), function(req, res){
	console.log("Listening on port " + app.get('port'));
});

// array of all lines drawn
var line_history = [];

// event-handler for new incoming connections
io.on('connection', function (socket) {

   // first send the history to the new client
   for (var i in line_history) {
      socket.emit('draw_line', { line: line_history[i] } );
   }

   // add handler for message type "draw_line".
   socket.on('draw_line', function (data) {
      // add received line to history 
      line_history.push(data.line);
      // send line to all clients
      io.emit('draw_line', { line: data.line });
   });
});