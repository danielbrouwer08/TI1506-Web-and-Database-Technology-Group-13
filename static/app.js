var main = function (ToDoObjects) {
	"use strict";

	// Array met alle todo items.

	
	var ToDoArray = ToDoObjects.map(function (ToDo) {
		return ToDo;
	});
	
	// sorteer de todo's die van de server komen.
	sortlist(ToDoArray); 
	
	//addRemoveButtons(ToDoArray) //add remove button on clicks

	$("#TodayList,#WeekList,#MonthList").hide(); //hide all but the allList at start


	// Laat alle Today zien
	$(".TodayButton").on("click", "button", function () {

		$("#TodayList").show();
		$("#WeekList,#MonthList,#AllList").hide();
		//console.log(" Today clicked");

	});

	// Laat alle 7Days zien
	$(".7DaysButton").on("click", "button", function () {

		$("#WeekList").show();
		$("#TodayList,#MonthList,#AllList").hide();
		//console.log(" 7Days clicked");

	});

	// Laat alle month zien
	$(".MonthButton").last().on("click", "button", function () {

		$("#MonthList").show();
		$("#TodayList,#WeekList,#AllList").hide();
		//console.log(" month clicked");
	});

	//Laat alles zien
	$(".EveryButton").last().on("click", "button", function () {

		$("#AllList").show();
		$("#TodayList,#WeekList,#MonthList").hide();
		//console.log(" every clicked");

	});


	// Add Task 



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

	// priority
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


	$("#ReminderIn").on("click", "input", function () {

		if ($("#ReminderIn input").val() === "d-m-year") {
			$("#ReminderIn input").val("");
		}
		
	});

	$(".AddButton").on("click", "button", function () {

		//console.log(" Add geklikt");
		var desc = $("#TaskDescIn input").val();
		var ExInfo = $("#ExtraInfoIn input").val();

		var da = $("#DateIn input").val();
		var remD = $("#ReminderIn input").val();
		
		var todoitem;
		
		lastid++;
		
		if(editId==false)
		{
			todoitem = new ToDo(desc, ExInfo, da, prio, remD, lastid);
			ToDoArray.push(todoitem);
		}
		else
		{
			todoitem = new ToDo(desc, ExInfo, da, prio, remD, tempid);
			ToDoArray.push(todoitem);
			editId=false;	
		}
		
		//sendData(ToDoArray); //send new data to the server
		
		sendTodo(todoitem);

		//for (var i = 0; i < ToDoArray.length; i++) {
//
		//	console.log(tostring(ToDoArray[i]));
		//}

		sortlist(ToDoArray); //sort list to week, day month every time todo gets added.
		
		//addRemoveButtons(ToDoArray) //add remove button on clicks

		window.alert("ToDo addded");

	});
	
	//Remove button clicked
	//for(var i=0;i<ToDoArray.length;i++)
	//{
	//
	// var temp = ".todoNO"+ i;
		
	// $(temp).on("click", "button", function () {

	// console.log(temp + " my delete button is clicked :(");
	// });
		
	// }

}

// print
var tostring = function (Object) { return "ToDo: " + Object.subject + ", " + Object.extraInfo + ", " + Object.dueDate + ", " + Object.priority + ", " + Object.reminderDate };

function sendTodo(todoitem){
	$.post("/saveTodo", todoitem, function (response) {
		console.log("Todo send");
		//console.log(response);
	});
}


function sendData(ToDoArray) {

	$.post("/save", { "list": ToDoArray }, function (response) {
		console.log("Data send");
		console.log(response);
	});

}

function emptyList() {
	//var $nameTemp = $("<li>");

	$("#AllList").empty(); //clear displayed list
	$("#TodayList").empty();
	$("#MonthList").empty();
	$("#WeekList").empty();

	//var $nameTemp = $("<h2>");
	//$nameTemp.text("Todo's for today:");
	//$("#TodayList").append($nameTemp);
	//$nameTemp.text("Todo's this month:");
	//$("#MonthList").append($nameTemp);
	//$nameTemp.text("Todo's this week:");
	//$("#WeekList").append($nameTemp);
	//$nameTemp.text("All todo's:");
	//$("#AllList").append($nameTemp);

}

function sortlist(ToDoArray) {

	emptyList();

	//console.log("sorting the following list:");

	ToDoArray.sort(function(a, b) {
		var temp1 = a.dueDate.split("-")
		var temp2 = b.dueDate.split("-")
		//var dateA = new Date(temp1[2],temp1[1],temp1[0]);
    	//var dateB = new Date(temp2[2],temp2[1],temp2[0]);
		a = temp1[2] + temp1[1] + temp1[0];
    	b = temp2[2] + temp2[1] + temp2[0];
    	return a>b ? -1 : a<b ? 1 : 0;
	});
	
	ToDoArray.reverse();

	//Get current date:
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yy = today.getFullYear();

	for (var i = 0; i < ToDoArray.length; i++) {
	var temp = ToDoArray[i].dueDate.split("-");
		
	//console.log(toString(ToDoArray[i]));
	}

	//console.log("year: " + yy);

	//Sort the list by date:
	for (var i = 0; i < ToDoArray.length; i++) {
		//in the AllList, all items should be displayed
		//var $allTemp = $("<li>");
		//$allTemp.text(tostring(ToDoArray[i]));
		
		var temp = ToDoArray[i].dueDate.split("-");
		//console.log(temp[0] == dd && temp[2] == yy);
		//console.log(temp[0] + " should be equal to: " + dd + " " + temp[2] + " should be equal to: " + yy);
		
		//mark overdue todo's
		if (temp[2] < yy) {
			ToDoArray[i].overDue = true;
		} else if (temp[1] < mm && temp[2] == yy) {
			ToDoArray[i].overDue = true;
		} else if (temp[0] < dd && temp[1] == mm && temp[2] == yy) {
			ToDoArray[i].overDue = true;
		}
	
		
		var allTemp = "<li priority=" + ToDoArray[i].priority + " overDue=" + ToDoArray[i].overDue + " done=" + ToDoArray[i].done + ">" + tostring(ToDoArray[i]) + "<section class = \"todoNO" + i + "\"><button id = \"todoNO" + i + "\">REMOVE</button></section>" + "<section class = \"todoDoneNO" + i + "\"> + <button id = \"todoDoneNO" + i + "\">DONE</button></section>" + "<section class = \"todoEditNO" + i + "\"> + <button id = \"todoEditNO" + i + "\">Edit</button></section>" + "</li>"; 
		//var allTemp = "<li priority=" + ToDoArray[i].priority + " subject=" + ToDoArray[i].subject + " extraInfo" + ToDoArray[i].extraInfo + " dueDate" + ToDoArray[i].dueDate + " reminderDate" + ToDoArray[i].reminderDate + ">" + "<section class = \"todoNO" + i + "\"><button id = \"todoNO" + i + "\">REMOVE</button></section></li>"; 
		$("#AllList").append(allTemp);

		if (temp[0] == dd && temp[1] == mm && temp[2] == yy) //if day, month and year matches add to the todaylist
		{
			//var $temp = $("<li>");
			//$temp.text(tostring(ToDoArray[i]));
			
			var temp = "<li priority=" + ToDoArray[i].priority + " overDue=" + ToDoArray[i].overDue + " done=" + ToDoArray[i].done + ">" + tostring(ToDoArray[i]) + "<section class = \"todoNO" + i + "\"><button id = \"todoNO" + i + "\">REMOVE</button></section>" + "<section class = \"todoDoneNO" + i + "\"> + <button id = \"todoDoneNO" + i + "\">DONE</button></section>" + "<section class = \"todoEditNO" + i + "\"> + <button id = \"todoEditNO" + i + "\">Edit</button></section>" +  "</li>"; 
			//var Temp = "<li priority=" + ToDoArray[i].priority + " subject=" + ToDoArray[i].subject + " extraInfo" + ToDoArray[i].extraInfo + " dueDate" + ToDoArray[i].dueDate + " reminderDate" + ToDoArray[i].reminderDate + ">" + "<section class = \"todoNO" + i + "\"><button id = \"todoNO" + i + "\">REMOVE</button></section></li>";  
			$("#TodayList").append(temp);
		}
		if (temp[0] > dd && temp[0] < dd + 7 && temp[1] == mm && temp[2] == yy) {
			//var $temp = $("<li>");
			//$temp.text(tostring(ToDoArray[i]));
			
			var temp = "<li priority=" + ToDoArray[i].priority + " overDue=" + ToDoArray[i].overDue + " done=" + ToDoArray[i].done + ">" + tostring(ToDoArray[i]) + "<section class = \"todoNO" + i + "\"><button id = \"todoNO" + i + "\">REMOVE</button></section>" + "<section class = \"todoDoneNO" + i + "\"> + <button id = \"todoDoneNO" + i + "\">DONE</button></section>" + "<section class = \"todoEditNO" + i + "\"> + <button id = \"todoEditNO" + i + "\">Edit</button></section>" + "</li>"; 
			//var Temp = "<li priority=" + ToDoArray[i].priority + " subject=" + ToDoArray[i].subject + " extraInfo" + ToDoArray[i].extraInfo + " dueDate" + ToDoArray[i].dueDate + " reminderDate" + ToDoArray[i].reminderDate + ">" + "<section class = \"todoNO" + i + "\"><button id = \"todoNO" + i + "\">REMOVE</button></section></li>"; 
			
			$("#WeekList").append(temp);
		}
		//console.log("month: " + temp[1] + " equal to: " + mm);

		if (temp[1] == mm && temp[2] == yy)//if month and year matches add to the monthlist
		{
			//var $temp = $("<li>");
			//$temp.text(tostring(ToDoArray[i]));
			var temp = "<li priority=" + ToDoArray[i].priority + " overDue=" + ToDoArray[i].overDue + " done=" + ToDoArray[i].done + ">" + tostring(ToDoArray[i]) + "<section class = \"todoNO" + i + "\"><button id = \"todoNO" + i + "\">REMOVE</button></section>" + "<section class = \"todoDoneNO" + i + "\"> + <button id = \"todoDoneNO" + i + "\">DONE</button></section>" + "<section class = \"todoEditNO" + i + "\"> + <button id = \"todoEditNO" + i + "\">Edit</button></section>" + "</li>"; 
			
			//var Temp = "<li priority=" + ToDoArray[i].priority + " subject=" + ToDoArray[i].subject + " extraInfo" + ToDoArray[i].extraInfo + " dueDate" + ToDoArray[i].dueDate + " reminderDate" + ToDoArray[i].reminderDate + ">" + "<section class = \"todoNO" + i + "\"><button id = \"todoNO" + i + "\">REMOVE</button></section></li>"; 
			$("#MonthList").append(temp);
		}
		
		//dynamically add the onclick event functions for the remove buttons
		var tempRemove = ".todoNO" + i;
		$(tempRemove).on("click", "button", function () {
			var clickedBtnID = $(this).attr('id').replace("todoNO", ""); //get the buttonID clicked so the correct todo can be deleted
			//console.log('you clicked on button #' + clickedBtnID);
			ToDoArray.splice(clickedBtnID, 1); //remove todo from array
			sortlist(ToDoArray); //sort the list again
			sendData(ToDoArray); //send new data to the server
		});
		
		//dynamically add the onclick event functions for the done buttons
		var tempDone = ".todoDoneNO" + i;
		$(tempDone).on("click", "button", function () {
			var clickedBtnID = $(this).attr('id').replace("todoDoneNO", ""); //get the buttonID clicked
			//console.log('you clicked on donebutton #' + clickedBtnID);
			//ToDoArray.splice(clickedBtnID, 1); //remove todo from array
			ToDoArray[clickedBtnID].done = true; //set done field true
			sortlist(ToDoArray); //sort the list again
			sendData(ToDoArray); //send new data to the server
		});
		
		//dynamically add the onclick event functions for the done buttons
		var tempEdit = ".todoEditNO" + i;
		$(tempEdit).on("click", "button", function () {
			var clickedBtnID = $(this).attr('id').replace("todoEditNO", ""); //get the buttonID clicked
			//console.log('you clicked on editbutton #' + clickedBtnID);
			//ToDoArray.splice(clickedBtnID, 1); //remove todo from array
			
			var desc = $("#TaskDescIn input").val(ToDoArray[clickedBtnID].subject);
			var ExInfo = $("#ExtraInfoIn input").val(ToDoArray[clickedBtnID].extraInfo);

			var da = $("#DateIn input").val(ToDoArray[clickedBtnID].dueDate);
			var remD = $("#ReminderIn input").val(ToDoArray[clickedBtnID].reminderDate);
			
			tempid = ToDoArray[clickedBtnID].id;
			editId=true;
			
			//console.log(ToDoArray[clickedBtnID].priority);
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
			
			ToDoArray.splice(clickedBtnID, 1); //remove todo from array
		});

	}

};

$(document).ready(function () {
	$.getJSON("/lastid", function (res) {
		lastid = res;
		console.log("lastid: " + res);	
	});
	
	$.getJSON("/getTodo", function (ToDoObjects) {
		console.log(ToDoObjects);

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
	this.overDue = false;
	this.done = false;
	this.id = id;
}

var lastid;
var editId=false;
var tempid;


