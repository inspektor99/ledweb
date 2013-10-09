/**
 * Module dependencies.
 */

var ledstrip = require('./ledstrip');
var ledcontroller = require('./public/js/ledcontroller.js');

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var emulating = false;
if (!emulating) {
	var ledstripe = require('ledstripe');

	ledstripe.connect(25, 'WS2801', '/dev/spidev0.0');
	var buffer = new Buffer(3*25);
	var i = 0;
	//init
	for (i = 0; i < 75; i+=3) {
		buffer[i] = 0;
		buffer[i+1] = 0;
		buffer[i+2] = 255;
	}
	ledstripe.sendRgbBuf(buffer);
}

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/ledem', routes.ledem);

var server = http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

ledstrip.setServer(server);

app.put('/setLedStrip', function(req, res) {
	ledstrip.changeAll(req.body.color);
	res.send({success: true});
});