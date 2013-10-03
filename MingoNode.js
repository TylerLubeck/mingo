var express = require("express");
var escape = require('escape-html');
var app = express();
app.use(express.static(__dirname + '/static'));
app.use(express.logger());
app.use(express.bodyParser());

app.use('/', express.static(__dirname + '/static'));

var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI || 
	process.env.MONGOHQ_URI ||
	'mongodb://localhost/mingo_db';

var db = mongo.Db.connect(mongoUri, function(err, dbConnection) {
	db = dbConnection;
});


var INSERT_PASSWORD = 'SETUP';


/*
var io = require('socket.io').listen(80);
io.configure(function() {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
});
*/

app.post('/AddSquare', function(request, response) {
	console.log(typeof(request.body.password));
	if (request.body.password == INSERT_PASSWORD) {
		square = request.body.square;
		db.collection('squares', function(err, collection){
			record = new Object();
			record.dateAdded = new Date().toDateString();
			record.square = square;
			collection.insert(record, function(err, inserted){
					if(err) {
						response.send(400);
					} else {
						response.send(200);
					}
			});
		});
	}
	response.send(401);
});




app.get('/possibilities', function(request, response) {
	var html = "<html><head></head><body><ol>"
	db.collection('squares', function(err, collection) {
		var cursor = collection.find();
		allData = [];
		cursor.toArray(function(err, documents){
			for(i in documents) {
				html += "<li>" + documents[i].square + ' : ' + documents[i].dateAdded + '</li>'
			}
			html += "</ol></body></html>"
			response.send(html);
		});
	});

});

app.get('/possibilities.json', function(request, response) {
	db.collection('squares', function(err, collection) {
		var cursor = collection.find();
		allData = [];
		cursor.toArray(function(err, documents){
			response.send(JSON.stringify(documents));
		});
	});

});

/*
app.get('/AddForm', function(reqest, response) {
	html = '<html><head></head><body>';
	html += '<form name="input" action="/AddSquare" method="POST">';
	html += 'Quote: <input type="text" name="square"></br>';
	html += 'PW: <input type="password" name="password"></br>';
	html += '<input type="submit" value="Submit">';
	html += '</form></body></html>';

	response.send(html);
})
*/

/*
app.get('/', function(request, response) {
    response.send('Hello World');
});
*/

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
