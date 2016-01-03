var main = function (ToDoObjects) {
	"use strict";

	// Array met alle todo items.
	var ToDoArray = ToDoObjects.map(function (ToDo) {
		return ToDo;
	});
	
	// sorteer de todo's die van de server komen.
	sortlist(ToDoArray); 

	//#################-SORT BUTTONS-########################//
	
	$("#TodayList,#WeekList,#MonthList").hide(); //hide all but the allList at start

	// Laat alle Today zien
	$(".TodayButton").on("click", "button", function () {
		$("#TodayList").show();
		$("#WeekList,#MonthList,#AllList").hide();
	});

	// Laat alle 7Days zien
	$(".7DaysButton").on("click", "button", function () {
		$("#WeekList").show();
		$("#TodayList,#MonthList,#AllList").hide();
	});

	// Laat alle month zien
	$(".MonthButton").last().on("click", "button", function () {
		$("#MonthList").show();
		$("#TodayList,#WeekList,#AllList").hide();
	});

	//Laat alles zien
	$(".EveryButton").last().on("click", "button", function () {
		$("#AllList").show();
		$("#TodayList,#WeekList,#MonthList").hide();
	});

	//#################-REMOVE TEXT FROM FORMFIELDS-########################//
	$("#TaskDescIn").on("click", "input", function () {

		var TDIN = $("#TaskDescIn input");

		if (TDIN.val() === "Subject") {
			TDIN.val("");
		}

	});

	$("#ExtraInfoIn").on("click", "input", function () {

		if ($("#ExtraInfoIn input").val() === "Extra info") {
			$("#ExtraInfoIn input").val("");
		}

	});

	$("#DateIn").on("click", "input", function () {

		if ($("#DateIn input").val() === "d-m-year") {
			$("#DateIn input").val("");
		}

	});
	
		$("#ReminderIn").on("click", "input", function () {

		if ($("#ReminderIn input").val() === "d-m-year") {
			$("#ReminderIn input").val("");
		}
		
	});

	//#################-PRIORITY BUTTONS-########################//
	var prio;

	$(".Groen").on("click", "button", function () {
		$("#Rood").removeClass("down");
		$("#Geel").removeClass("down");
		$("#Groen").addClass("down");
		prio = 1;
	});

	$(".Geel").on("click", "button", function () {
		$("#Groen").removeClass("down");
		$("#Rood").removeClass("down");
		$("#Geel").addClass("down");
		prio = 2;
	});


	$(".Rood").on("click", "button", function () {
		$("#Groen").removeClass("down");
		$("#Geel").removeClass("down");
		$("#Rood").addClass("down");
		prio = 3;
	});

	//#################-ADD BUTTON-########################//
	$(".AddButton").on("click", "button", function () {
		
		var desc = $("#TaskDescIn input").val();
		var ExInfo = $("#ExtraInfoIn input").val();
		var da = $("#DateIn input").val();
		var remD = $("#ReminderIn input").val();
		
		var todoitem;
		
		if(editId==false) //add new todo
		{
			lastid++;
			console.log("lastid: " + lastid);
			todoitem = new ToDo(desc, ExInfo, da, prio, remD, lastid);
			ToDoArray.push(todoitem);
		}
		else //replace todo
		{
			console.log("tempid: " + tempid);
			todoitem = new ToDo(desc, ExInfo, da, prio, remD, tempid);
			ToDoArray.push(todoitem);
			editId=false;	
		}
		
		sendTodo(todoitem); //send the new todo to the server

		sortlist(ToDoArray); //sort list to week, day month every time todo gets added.

		window.alert("ToDo addded"); //alert user that the todo is succesfully added
	});
}//end of main

// print
var tostring = function (Object) { return "ToDo: " + Object.subject + ", " + Object.extraInfo + ", " + Object.dueDate + ", " + Object.priority + ", " + Object.reminderDate };

//Send one todo to the server
function sendTodo(todoitem){
	$.post("/saveTodo", todoitem, function (response) {
		console.log("Todo send");
	});
}

//Remove todo from server
function removeTodo(todoitem){
	$.post("/deleteTodo", todoitem, function (response) {
		console.log("Todo to remove send");
	});
}

//send all todo's to the server
function sendData(ToDoArray) {
	$.post("/save", { "list": ToDoArray }, function (response) {
		console.log("Data send");
	});

}

//Delete all entries in all the displayed lists on the webpage
function emptyList() {
	$("#AllList").empty(); //clear displayed list
	$("#TodayList").empty();
	$("#MonthList").empty();
	$("#WeekList").empty();
}

//Sort all todo items according to date and catogorize into month, week, day and all list
function sortlist(ToDoArray) {
	
	emptyList();
	
	//Sort the list by date
	ToDoArray.sort(function(a, b) {
		var temp1 = a.dueDate.split("-")
		var temp2 = b.dueDate.split("-")
		a = temp1[2] + temp1[1] + temp1[0];
    	b = temp2[2] + temp2[1] + temp2[0];
    	return a>b ? -1 : a<b ? 1 : 0;
	});
	
	ToDoArray.reverse(); //reverse the order

	//Get current date:
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yy = today.getFullYear();

	//Sort the list by date:
	for (var i = 0; i < ToDoArray.length; i++) {
		var temp = ToDoArray[i].dueDate.split("-");
		
		//mark overdue todo's
		if (temp[2] < yy) {
			ToDoArray[i].overDue = 1; //(true)
		} else if (temp[1] < mm && temp[2] == yy) {
			ToDoArray[i].overDue = 1;
		} else if (temp[0] < dd && temp[1] == mm && temp[2] == yy) {
			ToDoArray[i].overDue = 1;
		}
	
		//Fill the all-list
		var allTemp = "<li priority=" + ToDoArray[i].priority + " overDue=" + ToDoArray[i].overDue + " done=" + ToDoArray[i].done + ">" + tostring(ToDoArray[i]) + "<section class = \"todoNO" + i + "\"><button id = \"todoNO" + i + "\">REMOVE</button></section>" + "<section class = \"todoDoneNO" + i + "\"> + <button id = \"todoDoneNO" + i + "\">DONE</button></section>" + "<section class = \"todoEditNO" + i + "\"> + <button id = \"todoEditNO" + i + "\">Edit</button></section>" + "</li>"; 
		$("#AllList").append(allTemp);

		//Fill the today-list
		if (temp[0] == dd && temp[1] == mm && temp[2] == yy) //if day, month and year matches add to the todaylist
		{
			var temp = "<li priority=" + ToDoArray[i].priority + " overDue=" + ToDoArray[i].overDue + " done=" + ToDoArray[i].done + ">" + tostring(ToDoArray[i]) + "<section class = \"todoNO" + i + "\"><button id = \"todoNO" + i + "\">REMOVE</button></section>" + "<section class = \"todoDoneNO" + i + "\"> + <button id = \"todoDoneNO" + i + "\">DONE</button></section>" + "<section class = \"todoEditNO" + i + "\"> + <button id = \"todoEditNO" + i + "\">Edit</button></section>" +  "</li>"; 

			$("#TodayList").append(temp);
		}
		//Fill the week-list
		if (temp[0] > dd && temp[0] < dd + 7 && temp[1] == mm && temp[2] == yy) 
		{
			var temp = "<li priority=" + ToDoArray[i].priority + " overDue=" + ToDoArray[i].overDue + " done=" + ToDoArray[i].done + ">" + tostring(ToDoArray[i]) + "<section class = \"todoNO" + i + "\"><button id = \"todoNO" + i + "\">REMOVE</button></section>" + "<section class = \"todoDoneNO" + i + "\"> + <button id = \"todoDoneNO" + i + "\">DONE</button></section>" + "<section class = \"todoEditNO" + i + "\"> + <button id = \"todoEditNO" + i + "\">Edit</button></section>" + "</li>"; 
			
			$("#WeekList").append(temp);
		}
		//Fill the month-list
		if (temp[1] == mm && temp[2] == yy)//if month and year matches add to the monthlist
		{
			var temp = "<li priority=" + ToDoArray[i].priority + " overDue=" + ToDoArray[i].overDue + " done=" + ToDoArray[i].done + ">" + tostring(ToDoArray[i]) + "<section class = \"todoNO" + i + "\"><button id = \"todoNO" + i + "\">REMOVE</button></section>" + "<section class = \"todoDoneNO" + i + "\"> + <button id = \"todoDoneNO" + i + "\">DONE</button></section>" + "<section class = \"todoEditNO" + i + "\"> + <button id = \"todoEditNO" + i + "\">Edit</button></section>" + "</li>"; 
			
			$("#MonthList").append(temp);
		}
		
		//Dynamically add the onclick event functions for the remove buttons
		var tempRemove = ".todoNO" + i;
		$(tempRemove).on("click", "button", function () {
			var clickedBtnID = $(this).attr('id').replace("todoNO", ""); //get the buttonID clicked so the correct todo can be deleted
			removeTodo(ToDoArray[clickedBtnID]); //remove todo from server
			ToDoArray.splice(clickedBtnID, 1); //remove todo from array
			sortlist(ToDoArray); //sort the list again
		});
		
		//Dynamically add the onclick event functions for the done buttons
		var tempDone = ".todoDoneNO" + i;
		$(tempDone).on("click", "button", function () {
			var clickedBtnID = $(this).attr('id').replace("todoDoneNO", ""); //get the buttonID clicked
			ToDoArray[clickedBtnID].done = 1; //set done field true
			sendTodo(ToDoArray[clickedBtnID]); //send updated todo to the server
			sortlist(ToDoArray); //sort the list again
		});
		
		//Dynamically add the onclick event functions for the edit buttons
		var tempEdit = ".todoEditNO" + i;
		$(tempEdit).on("click", "button", function () {
			var clickedBtnID = $(this).attr('id').replace("todoEditNO", ""); //get the buttonID clicked
			
			//Fill the forms with the data of the to be edited todo
			var desc = $("#TaskDescIn input").val(ToDoArray[clickedBtnID].subject);
			var ExInfo = $("#ExtraInfoIn input").val(ToDoArray[clickedBtnID].extraInfo);

			var da = $("#DateIn input").val(ToDoArray[clickedBtnID].dueDate);
			var remD = $("#ReminderIn input").val(ToDoArray[clickedBtnID].reminderDate);
			
			//Set the correct priority button
			if(ToDoArray[clickedBtnID].priority=="1")
			{
				$("#Rood").removeClass("down");
				$("#Geel").removeClass("down");
				$("#Groen").addClass("down");
				prio = 1;
			}else if(ToDoArray[clickedBtnID].priority=="2")
			{
				$("#Groen").removeClass("down");
				$("#Rood").removeClass("down");
				$("#Geel").addClass("down");
				prio = 2;			
			}else if(ToDoArray[clickedBtnID].priority=="3")
			{
				$("#Groen").removeClass("down");
				$("#Geel").removeClass("down");
				$("#Rood").addClass("down");
				prio = 3;
			}
			
			tempid = ToDoArray[clickedBtnID].id; //store the id of the to be edited todo
			editId=true; //indicates that editmode is enabled (used to keep track of right ID number)
			
			ToDoArray.splice(clickedBtnID, 1); //remove todo from array
		});
	}
};

$(document).ready(function () {
	//Get lastid from server
	$.getJSON("/lastid", function (res) {
		lastid = res;
		console.log("Lastid received from server: " + res);	
	});
	
	//Get all todo's from the server
	$.getJSON("/getTodo", function (ToDoObjects) {
		main(ToDoObjects);
	});

});


//Constructor for ToDo
function ToDo(subject, extraInfo, dueDate, priority, reminderDate,id) {
	this.subject = subject;
	this.extraInfo = extraInfo;
	this.dueDate = dueDate;
	this.priority = priority;
	this.reminderDate = reminderDate;
	this.overDue = 0;
	this.done = 0;
	this.id = id;
}

//Global variables to keep track of lastid
var lastid;
var editId=false;
var tempid;


