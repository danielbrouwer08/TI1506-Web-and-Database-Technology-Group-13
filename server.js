"use strict"
var ejs = require("ejs")
var express = require("express");
var url = require("url");
var http = require("http");
var bodyparser = require("body-parser");
var jsonfile = require("jsonfile");
var fb = require("fb");
var passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;
var session = require('express-session')
// Self made modules
var todoAction = require("ToDoActions.js");
var pages = require("pages.js");
var query = require("querys.js");
//

var server;

var ToDoArray = new Array();
var userData;

var port = 8000;


server = express();
var connection = todoAction.connection;

//locate views for ejs
server.set('views', __dirname + '/views');
server.set('view engine', 'ejs');
server.use(session({secret: 'secretsession'}));
server.use(passport.initialize());
server.use(passport.session());
server.use(bodyparser.urlencoded({ extended: true }));
server.use(bodyparser.json());
server.use(express.static('static'));


pages.app(server,passport);
pages.splash(server);
pages.dashboard(server);
todoAction.save(server);

passport.use(new FacebookStrategy({
    clientID: fb.appID,
    clientSecret: fb.appSecret,
    callbackURL: fb.callbackUrl,
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
	var temp = new fbUser(profile.id,profile.displayName);
    done(null,temp);
  }
));

server.get('/login/facebook', passport.authenticate('facebook'));

server.get('/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/splash' }),
  function(req, res) {
    // Successful authentication, redirect home.
	//console.log(req.user.facebookId);
    res.redirect('/app');
  });

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

  
  //Send all todo's from the database to the client
server.get("/getTodo", function (req, res) {
	var user = req.user;
	console.log("user");
	console.log(user.facebookId);
	console.log("req:");
	console.log(req);
	connection.query('Select * From todoitem WHERE todoitem.DueDate is not null and todoitem.CompletionDate is not null', function (error, results, fiels) {
		console.log(error); //log any errors
		ToDoArray = [];
		
		//Fill empty ToDoArray with data from database
		for (var i = 0; i < results.length; i++) {
			//Format both Date strings so client understands it
			var dueDate = todoAction.dateToString(results[i].DueDate);
			var completionDate = todoAction.dateToString(results[i].CompletionDate);

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

//Client sends ToDo to server that has to be saved/altered in the database
server.post("/saveTodo", function (req, res) {
	var temptodo = req.body;
	var id = req.user.facebookId;
	
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

todoAction.lastId(server);
 

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

//Constructor for user
function fbUser(facebookId,displayName)
{
	this.facebookId = facebookId;
	this.displayName = displayName;
}



//SQL Queries

query.todosAmount(server,connection,ejs); 
query.getTodoList(server,connection,ejs);
query.getTodoItems(server,connection,ejs); 
query.get5TodoItems(server,connection,ejs);
query.getTodoItemsFilterd(server,connection,ejs);
query.getSubItems(server,connection,ejs);
query.getTags(server,connection,ejs);
query.todoListByTag(server,connection,ejs);
query.totalPendingAndCompleted(server,connection,ejs);
query.todosCompletedEachWeek(server,connection,ejs);
query.tagsFrequency(server,connection,ejs);
query.averageCompletionTime(server,connection,ejs);
query.lowerThenAverageCompletionTime(server,connection,ejs);


http.createServer(server).listen(port);