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
		
		var temp1 = temptodo.dueDate.split("-")
		var temp2 = temptodo.reminderDate.split("-")
		
		var dueDate = temp1[2] + "-" + temp1[1] + "-" + temp1[0]; //Datum omdraaien voor de database
    	var reminderDate = temp2[2] + "-" + temp2[1] + "-" + temp2[0];
		
		var delquery = "DELETE FROM todoItem where Id=" + temptodo.id
		connection.query(delquery, function (error, results, fiels) {
			console.log(error);
		});
		
		var query = "INSERT INTO todoitem (Id,Title,Text,DueDate,CompletionDate,Priority,Completed,ToDoListID) VALUES('" + temptodo.id + "','" + temptodo.subject + "','" + temptodo.extraInfo + "','" + dueDate + "','" + reminderDate + "','" + temptodo.priority + "','" + temptodo.done + "','" + 1 + "')";
		console.log(query);
		connection.query(query, function (error, results, fiels) {
			console.log(error);
		});
		
	});

	//var ToDo = (req.body);
});

server.post("/deleteTodo", function (req, res) {
	var temptodo = req.body;
	console.log("deleting todo from server");
	var delquery = "DELETE FROM todoItem where Id=" + temptodo.id
		connection.query(delquery, function (error, results, fiels) {
			console.log(error);
		});
	
	
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
		console.log("lastid: " + results[0].maxid);
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

			console.log("id op server: " + results[i].Id);	
			var temp = new ToDo(results[i].Title, results[i].Text, dueDate, results[i].Priority, completionDate, results[i].Id);
			temp.done = results[i].Completed;
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


