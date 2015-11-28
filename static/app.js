var main = function (ToDoObjects) {
	"use strict";

	// Array met alle todo items.

	
	var ToDoArray = ToDoObjects.map(function(ToDo){
		return ToDo;
	});
	
	// sorteer de todo's die van de server komen.
	sortlist(ToDoArray); 
	
	//addRemoveButtons(ToDoArray) //add remove button on clicks

	$("#TodayList,#7DaysList,#MonthList").hide(); //hide all but the allList at start


	// Laat alle Today zien
	$(".TodayButton").on("click", "button", function () {

		$("#TodayList").show();
		$("#7DaysList,#MonthList,#AllList").hide();
		console.log(" Today clicked");

	});

	// Laat alle 7Days zien
	$(".7DaysButton").on("click", "button", function () {

		$("#7DaysList").show();
		$("#TodayList,#MonthList,#AllList").hide();
		console.log(" 7Days clicked");

	});

	// Laat alle month zien
	$(".MonthButton").last().on("click", "button", function () {

		$("#MonthList").show();
		$("#TodayList,#7DaysList,#AllList").hide();
		console.log(" month clicked");
	});

	//Laat alles zien
	$(".EveryButton").last().on("click", "button", function () {

		$("#AllList").show();
		$("#TodayList,#7DaysList,#MonthList").hide();
		console.log(" every clicked");

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
		prio = 1;
	});

	$(".Geel").on("click", "button", function () {
		prio = 2;
	});


	$(".Rood").on("click", "button", function () {
		prio = 3;
	});


	$("#ReminderIn").on("click", "input", function () {

		if ($("#ReminderIn input").val() === "d-m-year") {
			$("#ReminderIn input").val("");
		}

	});

	$(".AddButton").on("click", "button", function () {

		console.log(" Add geklikt");
		var desc = $("#TaskDescIn input").val();
		var ExInfo = $("#ExtraInfoIn input").val();

		var da = $("#DateIn input").val();
		var remD = $("#ReminderIn input").val();
		
			
		ToDoArray.push(new ToDo(desc, ExInfo, da, prio, remD));
		
		sendData(ToDoArray); //send new data to the server

		for (var i = 0; i < ToDoArray.length; i++) {

			console.log(tostring(ToDoArray[i]));
		}

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
var tostring = function(Object){ return "ToDo: " + Object.subject + ", " + Object.extraInfo + ", " + Object.dueDate + ", " + Object.priority + ", " + Object.reminderDate };

function sendData(ToDoArray) {
	
	$.post("/save",{"list" : ToDoArray}, function(response){
			console.log("Data send");
			console.log(response);
		});
		
}

function emptyList() {
	//var $nameTemp = $("<li>");

	$("#AllList").empty(); //clear displayed list
	$("#TodayList").empty();
	$("#MonthList").empty();
	$("#7DaysList").empty();

	//var $nameTemp = $("<h2>");
	//$nameTemp.text("Todo's for today:");
	//$("#TodayList").append($nameTemp);
	//$nameTemp.text("Todo's this month:");
	//$("#MonthList").append($nameTemp);
	//$nameTemp.text("Todo's this week:");
	//$("#7DaysList").append($nameTemp);
	//$nameTemp.text("All todo's:");
	//$("#AllList").append($nameTemp);

}


function sortlist(ToDoArray) {

	emptyList();

	console.log("sorting the following list:");

	for (var i = 0; i < ToDoArray.length; i++) {

		console.log(toString(ToDoArray[i]));
	}


	//Get current date:
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yy = today.getFullYear();

	console.log("year: " + yy);

	//Sort the list by date:
	for (var i = 0; i < ToDoArray.length; i++) {
		//in the AllList, all items should be displayed
		//var $allTemp = $("<li>");
		//$allTemp.text(tostring(ToDoArray[i]));
		var allTemp = "<li>" + tostring(ToDoArray[i]) + "<section class = \"todoNO" + i + "\"><button id = \"todoNO" + i + "\">REMOVE</button></section></li>"; 
		$("#AllList").append(allTemp);



		var temp = ToDoArray[i].dueDate.split("-");
		console.log(temp[0] == dd && temp[2] == yy);
		console.log(temp[0] + " should be equal to: " + dd + " " + temp[2] + " should be equal to: " + yy);

		if (temp[0] == dd && temp[1] == mm && temp[2] == yy) //if day, month and year matches add to the todaylist
		{
			//var $temp = $("<li>");
			//$temp.text(tostring(ToDoArray[i]));
			
			var temp = "<li>" + tostring(ToDoArray[i]) + "<section class = \"todoNO" + i + "\"><button id = \"todoNO" + i + "\">REMOVE</button></section></li>"; 
			
			$("#TodayList").append(temp);
		}
		if (temp[0] > dd && temp[0] < dd + 7 && temp[1] == mm && temp[2] == yy) {
			//var $temp = $("<li>");
			//$temp.text(tostring(ToDoArray[i]));
			
			var temp = "<li>" + tostring(ToDoArray[i]) + "<section class = \"todoNO" + i + "\"><button id = \"todoNO" + i + "\">REMOVE</button></section></li>"; 
			
			$("#7DaysList").append(temp);
		}
		console.log("month: " + temp[1] + " equal to: " + mm);

		if (temp[1] == mm && temp[2] == yy)//if month and year matches add to the monthlist
		{
			//var $temp = $("<li>");
			//$temp.text(tostring(ToDoArray[i]));
			var temp = "<li>" + tostring(ToDoArray[i]) + "<section class = \"todoNO" + i + "\"><button id = \"todoNO" + i + "\">REMOVE</button></section></li>"; 
			$("#MonthList").append(temp);
		}
		
		
		//dynamically add the onclick event functions for the remove buttons
		var tempRemove = ".todoNO"+ i;
		$(tempRemove).on("click", "button", function () {
		 	var clickedBtnID = $(this).attr('id').replace("todoNO",""); //get the buttonID clicked so the correct todo can be deleted
   			console.log('you clicked on button #' + clickedBtnID);
			ToDoArray.splice(clickedBtnID, 1); //remove todo from array
			sortlist(ToDoArray); //sort the list again
			sendData(ToDoArray); //send new data to the server
		});
		
		
	}

};

$(document).ready(function(){
	$.getJSON("/getTodo",function(ToDoObjects){
		console.log(ToDoObjects);
		main(ToDoObjects);
	});
	
});


//Constructor for ToDo
function ToDo(subject, extraInfo, dueDate, priority, reminderDate) {
	this.subject = subject;
	this.extraInfo = extraInfo;
	this.dueDate = dueDate;
	this.priority = priority;
	this.reminderDate = reminderDate;

	//Prototype functions for ToDo
	//ToDo.prototype.toString = function () { return "ToDo: " + this.subject + ", " + this.extraInfo + ", " + this.dueDate + ", " + this.priority + ", " + this.reminderDate };
	
}




