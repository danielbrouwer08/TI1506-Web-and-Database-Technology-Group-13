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

//Send the app html to the client
server.get("/app", function (req, res) {
	res.sendfile("app.html");
});

//Send the splash html to the client
server.get("/splash", function (req, res) {
	res.sendfile("splash.html");
});

//Save all Todo's from client in a JSON file (NOT USED ANYMORE)
server.post("/save", function (req, res) {
	console.log("data has been posted");
	res.json({ "message": "You posted to the server" });
	console.log(req.body.list);
	ToDoArray = (req.body.list);
});


//Client sends ToDo to server that has to be saved/altered in the database
server.post("/saveTodo", function (req, res) {
	var temptodo = req.body;
	console.log("The following ToDo has been posted to the server:");
	console.log(temptodo);

	connection.query('Select * From todoitem WHERE todoitem.DueDate is not null and todoitem.CompletionDate is not null and todoitem.id=' + temptodo.id, function (error, results, fiels) {
		console.log(error); //log any errors
		
		if (results[0] == undefined) {
			console.log("Todo not in the list; adding it now");
		}else
		{
			console.log("Todo already in the list; altering it now");
		}

		//Alter date format so it will fit the database
		var temp1 = temptodo.dueDate.split("-")
		var temp2 = temptodo.reminderDate.split("-")
		var dueDate = temp1[2] + "-" + temp1[1] + "-" + temp1[0]; 
		var reminderDate = temp2[2] + "-" + temp2[1] + "-" + temp2[0];

		//Delete all todoItems with received ID
		var delquery = "DELETE FROM todoItem where Id=" + temptodo.id
		connection.query(delquery, function (error, results, fiels) {
			console.log(error);
		});

		//Add the received todo with received ID to the database
		var query = "INSERT INTO todoitem (Id,Title,Text,DueDate,CompletionDate,Priority,Completed,ToDoListID) VALUES('" + temptodo.id + "','" + temptodo.subject + "','" + temptodo.extraInfo + "','" + dueDate + "','" + reminderDate + "','" + temptodo.priority + "','" + temptodo.done + "','" + 1 + "')";
		connection.query(query, function (error, results, fiels) {
			console.log(error);
		});
	});
});


//Delete a ToDo from server/database
server.post("/deleteTodo", function (req, res) {
	var temptodo = req.body;
	console.log("Deleting todo from server");
	
	var query = "DELETE FROM todoItem where Id=" + temptodo.id
	connection.query(query, function (error, results, fiels) {
		console.log(error); //log any errors
	});

});


//Create an account on the server
server.post("/createaccount", function (req, res) {
	console.log("Userdata has been posted");

	userData = req.body;
	
	//Write data to jsonfile
	jsonfile.writeFile("users.json", userData, function () {
		console.log("Userdata saved in file on server");
	});
});

//Send the last ID for a todoitem in the database
server.get("/lastid", function (req, res) {

	connection.query('Select max(todoitem.id) as maxid From todoitem WHERE todoitem.DueDate is not null and todoitem.CompletionDate is not null', function (error, results, fiels) {
		console.log("Sending following lastid to the client: " + results[0].maxid);
		res.json(results[0].maxid);
	});
});

//Send all todo's from the database to the client
server.get("/getTodo", function (req, res) {
	connection.query('Select * From todoitem WHERE todoitem.DueDate is not null and todoitem.CompletionDate is not null', function (error, results, fiels) {
		console.log(error); //log any errors
		ToDoArray = [];
		
		//Fill empty ToDoArray with data from database
		for (var i = 0; i < results.length; i++) {
			//Format both Date strings so client understands it
			var dueDate = dateToString(results[i].DueDate);
			var completionDate = dateToString(results[i].CompletionDate);

			//Make new ToDo object from the database data
			var temp = new ToDo(results[i].Title, results[i].Text, dueDate, results[i].Priority, completionDate, results[i].Id);
			temp.done = results[i].Completed;
			//Add it to the ToDoArray
			ToDoArray.push(temp);
		}
	
		//Send the whole ToDoArray to the client
		res.json(ToDoArray);
	});
	
});

//Returns string representation of date object that client understands
function dateToString(date){
	
	var dd = date.getDate();
	var mm = date.getMonth() + 1;
	var yy = date.getFullYear();

	return (dd + "-" + mm + "-" + yy);
}


//Constructor for ToDo object
function ToDo(subject, extraInfo, dueDate, priority, reminderDate, id) {
	this.subject = subject;
	this.extraInfo = extraInfo;
	this.dueDate = dueDate;
	this.priority = priority;
	this.reminderDate = reminderDate;
	this.overDue = 0;
	this.done = 0;
	this.id = id;
}



//SQL Queries
//Query 1:
server.get("/getTodoList", function (req, res) {
	var query = "SELECT TL.* FROM todo.ToDoList as TL, todo.User as U WHERE TL.Owner = U.id AND U.id =" + 1;
	connection.query(query, function (error, results, fiels) {
		console.log(error);
		console.log(results);
		res.json(results);
		//
	});
});

//Query 2
server.get("/getTodoItems", function (req, res) {
	var query = "SELECT I.* FROM todo.ToDoList AS L, todo.ToDoItem AS I WHERE L.Id = I.ToDoListID";
	connection.query(query, function (error, results, fiels) {
		console.log(error);
		console.log(results);
		res.json(results);
		//
	});
});

//Query 3
server.get("/get5TodoItems", function (req, res) {
	var query = "SELECT I.* FROM todo.ToDoList  AS L, todo.ToDoItem AS I WHERE L.Id  = I.ToDoListID LIMIT 5";
	connection.query(query, function (error, results, fiels) {
		console.log(error);
		console.log(results);
		res.json(results);
		//
	});
});

//Query 4
server.get("/getTodoItemsFilterd", function (req, res) {
	var query = "SELECT I.* FROM todo.ToDoList AS L, todo.ToDoItem AS I WHERE L.Id  = I.ToDoListID AND I.CreationDate < “2014-11-25%” AND I.Priority = 1 AND I.Completed = 0 ORDER BY I.CreationDate ";
	connection.query(query, function (error, results, fiels) {
		console.log(error);
		console.log(results);
		res.json(results);
		//
	});
});

//Query 5
server.get("/getSubItems", function (req, res) {
	var query = "SELECT I.* FROM todo.ToDoItem AS I WHERE I.ParentToDo = 1";
	connection.query(query, function (error, results, fiels) {
		console.log(error);
		console.log(results);
		res.json(results);
		//
	});
});

//Query 6
server.get("/getTags", function (req, res) {
	var query = "SELECT IT.* FROM todo.ItemTag AS IT WHERE IT.ToDoId = 1";
	connection.query(query, function (error, results, fiels) {
		console.log(error);
		console.log(results);
		res.json(results);
		//
	});
});

//Query 7:
server.get("/todoListByTag", function (req, res) {
	var query = "SELECT distinct TDL.*, TagId FROM todo.ToDoList AS TDL join todo.ToDoItem AS TDI ON (TDL.id = TDI.ToDoListID) JOIN todo.ItemTag AS IT ON (TDI.id = IT.ToDoID) WHERE IT.TagId =" + 3;
	connection.query(query, function (error, results, fiels) {
		console.log(error);
		console.log(results);
		res.json(results);
		//
	});
});

//Query 8
server.get("/totalPendingAndCompleted", function (req, res) {
	var query = "SELECT IT.TagId  , SUM( CASE WHEN I.Completed  =  1 then 1 else 0 and) AS Completed , SUM( CASE WHEN I.Completed = 0 then 1 else 0 end) AS Pending FROM todo.ItemTag AS TI inner join todo.ToDoItem AS I on IT.ToDoId = I.Id GROUP BY IT.TagId";
	connection.query(query, function (error, results, fiels) {
		console.log(error);
		console.log(results);
		res.json(results);
		//
	});
});

//Query 9:
server.get("/todosCompletedEachWeek", function (req, res) {
	var query = "SELECT Count(TDI.Completed) AS CompletedEachWeek FROM todo.ToDoItem as TDI WHERE YEAR(TDI.DueDate) = 2014 #YEAR(CURDATE()) GROUP BY WEEK(TDI.DueDate)";
	connection.query(query, function (error, results, fiels) {
		console.log(error);
		console.log(results);
		res.json(results);
		//
	});
});

//Query 11:
server.get("/tagsFrequency", function (req, res) {
	var query = "SELECT TDL.*, COUNT(IT.tagID) FROM todo.ToDoList AS TDL join todo.ToDoItem AS TDI ON (TDL.id = TDI.ToDoListID) JOIN todo.ItemTag AS IT ON (TDI.id = IT.ToDoID) GROUP BY TDL.id;";
	connection.query(query, function (error, results, fiels) {
		console.log(error);
		console.log(results);
		res.json(results);
		//
	});
});


