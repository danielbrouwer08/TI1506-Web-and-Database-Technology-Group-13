"use strict"
var express = require("express");
var url = require("url");
var http = require("http");
var bodyparser = require("body-parser");
var jsonfile = require("jsonfile");
var server;

var ToDoArray = new Array();
var userData;

var port = 8000;
server = express();
http.createServer(server).listen(port);

server.use(express.static('static'));

server.use(bodyparser.urlencoded({ extended: true}));
server.use(bodyparser.json());

server.get("/app",function(req,res){
	
	res.sendfile("app.html");
	
});

server.get("/splash",function(req,res){
	
	res.sendfile("splash.html");
	
});

server.post("/save", function(req,res){
	console.log("data has been posted");
	res.json({"message" : "You posted to the server"});
	console.log(req.body.list);
	
	ToDoArray = req.body.list;
	
	jsonfile.writeFile("todos.json", ToDoArray, function(){
	
		console.log("Array saved in file on server");
	});
});

server.post("/createaccount", function(req,res){
	console.log("userdata has been posted");
	res.json({"message" : "You posted to the server"});
	console.log(req.body);
	
	userData = req.body;
	
	jsonfile.writeFile("users.json", userData, function(){
	
	console.log("Array saved in file on server");
	});
});

server.get("/getTodo",function(req,res){
	jsonfile.readFile("todos.json",function(err,obj){
		console.log(obj);
		res.json(obj);	
	});
	
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