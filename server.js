var express = require("express");
var url = require("url");
var http = require("http");
var server;

var port = 8000;
server = express();
http.createServer(server).listen(port);
server.use(express.static('static'));

server.get("/app",function(req,res){
	
	res.sendfile("app.html");
	
});

server.get("/splash",function(req,res){
	
	res.sendfile("splash.html");
	
});


// server.get("/greetme",function(req,res){
// 	var query = url.parse(req.url,true).query;
// 	var name = ( query["name"]!=undefined) ?
// 	query["name"] : "Anonymous";
// 	res.send("Greetings "+name);
// });

// server.get("/goodbye",function(req,res){
// 	res.send("Goodbye you!");
// });