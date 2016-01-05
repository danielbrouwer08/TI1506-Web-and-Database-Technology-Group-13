"use strict"

//Query 0:
exports.todosAmount = function(server,connection,ejs){
server.get("/todosAmount", function (req, res) {
	var query = "Select Count(*) From todo.todoitem";
	connection.query(query, function (error, results, fiels) {
		//sending data + html using ejs template
		res.render('dashboard', {classname: 'todos_amount', caption: 'Amount of todos:', results: results });
	});
});
}

//Query 1:
exports.getTodoList = function(server,connection,ejs){
server.get("/getTodoList", function (req, res) {
	var query = "SELECT TL.* FROM todo.ToDoList as TL, todo.User as U WHERE TL.Owner = U.id AND U.id =" + 1;
	connection.query(query, function (error, results, fiels) {
		//sending data + html using ejs template
		res.render('dashboard', {classname: 'todo_list_id_1', caption: 'Todolist with id = 1', results: results });
	});
});
}

//Query 2
exports.getTodoItems = function(server,connection,ejs){
server.get("/getTodoItems", function (req, res) {
	var query = "SELECT I.* FROM todo.ToDoList AS L, todo.ToDoItem AS I WHERE L.Id = I.ToDoListID";
	connection.query(query, function (error, results, fiels) {
		//sending data + html using ejs template
		res.render('dashboard', {classname: 'todo_items', caption: 'All todo items:', results: results });
	});
});
}

//Query 3
exports.get5TodoItems = function(server,connection,ejs){
server.get("/get5TodoItems", function (req, res) {
	var query = "SELECT I.* FROM todo.ToDoList  AS L, todo.ToDoItem AS I WHERE L.Id  = I.ToDoListID LIMIT 5";
	connection.query(query, function (error, results, fiels) {
		//sending data + html using ejs template
		res.render('dashboard', {classname: '5_todo_items', caption: '5 todo items:', results: results });
	});
});
}

//Query 4
exports.getTodoItemsFilterd = function(server,connection,ejs){
server.get("/getTodoItemsFilterd", function (req, res) {
	var query = "SELECT I.* FROM todo.ToDoList AS L, todo.ToDoItem AS I WHERE L.Id  = I.ToDoListID AND I.CreationDate < '2014-11-22%' AND I.Priority = 1 AND I.Completed = 0 ORDER BY I.CreationDate";
	connection.query(query, function (error, results, fiels) {
		//sending data + html using ejs template
		res.render('dashboard', {classname: 'todo_items_filtered', caption: 'Todo items filtered:', results: results });
	});
});
}

//Query 5
exports.getSubItems = function(server,connection,ejs){
server.get("/getSubItems", function (req, res) {
	var query = "SELECT I.* FROM todo.ToDoItem AS I WHERE I.ParentToDo = 1";
	connection.query(query, function (error, results, fiels) {
		//sending data + html using ejs template
		res.render('dashboard', {classname: 'sub_items', caption: 'Subitems:', results: results });
	});
});
}

//Query 6
exports.getTags = function(server,connection,ejs){
server.get("/getTags", function (req, res) {
	var query = "SELECT IT.* FROM todo.ItemTag AS IT WHERE IT.ToDoId = 1";
	connection.query(query, function (error, results, fiels) {
		//sending data + html using ejs template
		res.render('dashboard', {classname: 'todo_tags', caption: 'User defined tags:', results: results });
	});
});
}

//Query 7:
exports.todoListByTag = function(server,connection,ejs){
server.get("/todoListByTag", function (req, res) {
	var query = "SELECT distinct TDL.*, TagId FROM todo.ToDoList AS TDL join todo.ToDoItem AS TDI ON (TDL.id = TDI.ToDoListID) JOIN todo.ItemTag AS IT ON (TDI.id = IT.ToDoID) WHERE IT.TagId =" + 3;
	connection.query(query, function (error, results, fiels) {
		//sending data + html using ejs template
		res.render('dashboard', {classname: 'todo_list_by_tag', caption: 'Todos sorted by tag:', results: results });
	});
});
}

//Query 8
exports.totalPendingAndCompleted = function(server,connection,ejs){
server.get("/totalPendingAndCompleted", function (req, res) {
	var query = "SELECT IT.TagId  , SUM( CASE WHEN I.Completed  =  1 then 1 else 0 end) AS Completed , SUM( CASE WHEN I.Completed = 0 then 1 else 0 end) AS Pending FROM todo.ItemTag AS IT inner join todo.ToDoItem AS I on IT.ToDoId = I.Id GROUP BY IT.TagId";
	connection.query(query, function (error, results, fiels) {
		//sending data + html using ejs template
		res.render('dashboard', {classname: 'pending_completed_todos', caption: 'Amount of pending and completed todos:', results: results });
	});
});
}

//Query 9:
exports.todosCompletedEachWeek = function(server,connection,ejs){
	server.get("/todosCompletedEachWeek", function (req, res) {
	var query = "SELECT Count(TDI.Completed) AS CompletedEachWeek FROM todo.ToDoItem as TDI WHERE YEAR(TDI.DueDate) = 2014 #YEAR(CURDATE()) GROUP BY WEEK(TDI.DueDate)";
	connection.query(query, function (error, results, fiels) {
		//sending data + html using ejs template
		res.render('dashboard', {classname: 'todos_completed_each_week', caption: 'Todo\'s completed each week in 2014:', results: results });
	});
});	
}

//Query 11:
exports.tagsFrequency = function(server,connection,ejs){
	server.get("/tagsFrequency", function (req, res) {
	var query = "SELECT TDL.*, COUNT(IT.tagID) FROM todo.ToDoList AS TDL join todo.ToDoItem AS TDI ON (TDL.id = TDI.ToDoListID) JOIN todo.ItemTag AS IT ON (TDI.id = IT.ToDoID) GROUP BY TDL.id;";
	connection.query(query, function (error, results, fiels) {
		//sending data + html using ejs template
		res.render('dashboard', {classname: 'tag_frequency', caption: 'Frequency of defined tags:', results: results });
	});
});	
}

//Query 12
exports.averageCompletionTime = function(server,connection,ejs){
	server.get("/averageCompletionTime", function (req, res) {
	var query = "SELECT AVG(TO_DAYS(TDI.CompletionDate)-TO_DAYS(TDI.CreationDate)) AS CompletionTime FROM todo.todoitem as TDI join todo.todolist as TDL on (TDL.id = TDI.ToDoListID) WHERE TDL.id=1 AND TDI.completiondate IS NOT NULL";
	connection.query(query, function (error, results, fiels) {
		//sending data + html using ejs template
		res.render('dashboard', {classname: 'average_completion_time', caption: 'Average completion time of a todoitem:', results: results });
	});
});	
}

//Query 13
exports.lowerThenAverageCompletionTime = function(server,connection,ejs){
server.get("/lowerThenAverageCompletionTime", function (req, res) {
	var query = "SELECT TDI.* FROM todo.todoitem as TDI join todo.todolist as TDL on (TDL.id = TDI.ToDoListID) WHERE TDI.completiondate IS NOT NULL GROUP BY ToDoListID HAVING (TO_DAYS(TDI.CompletionDate)-TO_DAYS(TDI.CreationDate))<=(AVG(TO_DAYS(TDI.CompletionDate)-TO_DAYS(TDI.CreationDate)))";
	connection.query(query, function (error, results, fiels) {
		//sending data + html using ejs template
		res.render('dashboard', {classname: 'lower_then_average_completion_time', caption: 'Todoitems per list with a lower then average completion time:', results: results });
	});
});
}






