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

var mysql = require('mysql')
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'webdata',
	database: 'todo'
})


server.use(express.static('static'));

server.use(bodyparser.urlencoded({ extended: true }));
server.use(bodyparser.json());

server.get("/app", function (req, res) {

	res.sendfile("app.html");

});

server.get("/splash", function (req, res) {

	res.sendfile("splash.html");

});

server.post("/save", function (req, res) {
	console.log("data has been posted");
	res.json({ "message": "You posted to the server" });
	console.log(req.body.list);

	ToDoArray = (req.body.list);
});


server.post("/saveTodo", function (req, res) {
	console.log("data has been posted");
	res.json({ "message": "You posted to the server" });
	console.log(req.body);

	var temptodo = req.body;
	
	connection.query('Select * From todoitem WHERE todoitem.DueDate is not null and todoitem.CompletionDate is not null and todoitem.id=' + temptodo.id , function (error, results, fiels) {
		console.log(error);
		//console.log(results);
		console.log("dingen:");
		console.log(results[0]);
		if(results[0]==undefined)
		{
			//ToDo is nieuw en staat nog niet in de tabel
			console.log("mooie dingen!");
		}
		
		var query = "INSERT INTO todoitem (Id,Title,Text,DueDate,CompletionDate,Priority) VALUES('" + temptodo.id + "','" + temptodo.subject + "','" + temptodo.extraInfo + "','" + temptodo.dueDate + "','" + temptodo.reminderDate + "','" + temptodo.priority + "')";
		console.log(query);
		connection.query(query, function (error, results, fiels) {
			console.log(error);
		});
		
	});

	//var ToDo = (req.body);
});


server.post("/createaccount", function (req, res) {
	console.log("userdata has been posted");
	res.json({ "message": "You posted to the server" });
	console.log(req.body);

	userData = req.body;

	jsonfile.writeFile("users.json", userData, function () {

		console.log("Array saved in file on server");
	});
});


server.get("/lastid", function (req, res) {
	
	connection.query('Select max(todoitem.id) as maxid From todoitem WHERE todoitem.DueDate is not null and todoitem.CompletionDate is not null', function (error, results, fiels) {
		//console.log(results);
		//console.log(results[0].maxid);
		res.json(results[0].maxid);
	});
});

server.get("/getTodo", function (req, res) {
	//jsonfile.readFile("todos.json",function(err,obj){
	//console.log(obj);
		
	//});
	connection.query('Select * From todoitem WHERE todoitem.DueDate is not null and todoitem.CompletionDate is not null', function (error, results, fiels) {
		console.log(error);
		//console.log(results);
		ToDoArray = [];

		for (var i = 0; i < results.length; i++) {
			//empty the array
		
			var due = results[i].DueDate;
			var completion = results[i].CompletionDate;
		
			//var dueDateString = dueDate.split(" ");
		
			// var month = dueDate.getMonth();
			// var day = dueDateString[2];
			// var year = dueDateString[3];
		
			var dd = due.getDate();
			var mm = due.getMonth() + 1;
			var yy = due.getFullYear();

			var dueDate = dd + "-" + mm + "-" + yy;

			dd = completion.getDate();
			mm = completion.getMonth() + 1;
			yy = completion.getFullYear();

			var completionDate = dd + "-" + mm + "-" + yy;

			console.log(dueDate);
			console.log(completionDate);

			var temp = new ToDo(results[i].Title, results[i].Text, dueDate, results[i].Priority, completionDate);
			ToDoArray.push(temp);

		}

	});


	console.log(ToDoArray.length);

	res.json(ToDoArray);

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


//Constructor for ToDo
function ToDo(subject, extraInfo, dueDate, priority, reminderDate) {
	this.subject = subject;
	this.extraInfo = extraInfo;
	this.dueDate = dueDate;
	this.priority = priority;
	this.reminderDate = reminderDate;
	this.overDue = false;
	this.done = false;


}
