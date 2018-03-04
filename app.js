var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

var server = http.createServer(app).listen(3000);
