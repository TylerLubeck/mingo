var express = require("express");
var escape = require('escape-html');
var app = express();
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


var INSERT_PASSWORD = 'SETUP';


/*
var io = require('socket.io').listen(80);
io.configure(function() {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
});
*/

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

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
