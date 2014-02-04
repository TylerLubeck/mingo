var express = require("express");
var escape = require('ent');
var app = express();
var http = require('http');

app.use(express.static(__dirname + '/static'));
app.use(express.logger());
app.use(express.bodyParser());
app.engine('html', require('ejs').renderFile)

app.use('/', express.static(__dirname + '/static'));
app.set('views', __dirname + '/static');

var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI || 
	process.env.MONGOHQ_URI ||
	'mongodb://localhost/mingo_db';

var db = mongo.Db.connect(mongoUri, function(err, dbConnection) {
	db = dbConnection;
//	db.collection('squares').drop();
});


var Manager = new function() {
    this._clients = [];
    this.clients = function() {
        return this._clients;
    }

    this.set = function(client, data) {
        this._clients[client.sessionId] = data;
        return this.count();
    };

    this.get = function(client) {
        return this._clients[client.sessionId];
    };

    this.remove = function(client) {
        var i = this._clients.indexOf(client);
        delete this._clients[i];
        return this.count();
    };

    this.count = function() {
        return Object.keys(this._clients).length;
    }
}


var SocketManager = Object.create(Manager); 

var INSERT_PASSWORD = 'SETUP';
var CONNECTED_USERS = 0;



app.post('/AddSquare', function(request, response) {
	if (request.body.password != INSERT_PASSWORD) {
		response.send(401);
		return;
	} else {
		console.log('worked');
		square = request.body.square;
		numDrinks = request.body.numDrinks;
		db.collection('squares', function(err, collection){
			record = new Object();
			record.dateAdded = new Date().toDateString();
			record.square = square;
			record.numDrinks = numDrinks;
			collection.insert(record, function(err, inserted){
					if(err) {
						response.send(400);
					} else {
						response.send(200);
					}
			});
		});
	}
	//response.send(401);
});




app.get('/possibilities', function(request, response) {
	response.render('possibilities.html');
});

app.get('/possibilities.json', function(request, response) {
	db.collection('squares', function(err, collection) {
		var cursor = collection.find();
		cursor.toArray(function(err, documents){
			response.send(JSON.stringify(documents));
		});
	});

});

app.get('/AddForm', function(request, response){
	response.render('addForm.html');
})

/*
app.get('/', function(request, response) {
    response.send('Hello World');
});
*/

var server = http.createServer(app);
var port = process.env.PORT || 5000;
server.listen(port, function() {
    console.log("Listening on " + port);
});


/* BEGIN SOCKET.IO */

var io = require('socket.io').listen(server);
io.configure(function(){
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 10);
});



io.sockets.on('connection', function(socket) {
	//socket.emit('news', {hello: 'world'});
    
    CONNECTED_USERS++;        

	socket.on('square clicked', function(data){
		socket.broadcast.emit('news', {info: 'somebody clicked ' + data.clicked})
	});

	socket.on('mingo', function(data){
		var name = (escape.encode(data.name));
		socket.broadcast.emit('news', {info: name + ' got Mingo!'});
	});

	socket.on('new user', function(data){
		var name = escape.encode(data.name);
        SocketManager.set(socket, name);
        console.log('Current players: ' +  SocketManager.count())
        console.log(SocketManager.clients());
		socket.broadcast.emit('add user', {
                                info: name + ' joined the game.',
                                numPlayers: SocketManager.count()
                                });
	});

    socket.on('winner', function(data){
        var name = escape.encode(data.name);
        var d = new Date();
        var proof = data.proof;
		db.collection('winners', function(err, collection){
			record = new Object();
			record.name = name;
			record.date = d;
			record.proof = proof;
			collection.insert(record, function(err, inserted){
			    console.log('Inserted winner: ' + proof);
            });
		});
    });

    socket.on('disconnect', function(){
        var name = SocketManager.get(socket);
        var count = SocketManager.remove(socket);
        socket.broadcast.emit('remove user', {
                                'info': name,
                                'numPlayers': count
        });
    });
});

/*
io.sockets.on('disconnect', function(socket) {
    CONNECTED_USERS --;
    console.log('disconnect');
    console.log(CONNECTED_USERS);
});
*/
