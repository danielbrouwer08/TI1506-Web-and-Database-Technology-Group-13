var express = require("express");
var url = require("url");
var http = require("http");
var server;

var port = 8000;
server = express();
http.createServer(server).listen(port);



server.get("/greetme",function(req,res){
	var query = url.parse(req.url,true).query;
	var name = ( query["name"]!=undefined) ?
	query["name"] : "Anonymous";
	res.send("Greetings "+name);
});

server.get("/goodbye",function(req,res){
	res.send("Goodbye you!");
});