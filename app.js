var main = function () {
	"use strict";

	// Array met alle todo items.

	var ToDoArray = new Array();

	//console.log("meh");	

	//Create 2 test ToDo objects
	//ToDoArray.push(new ToDo("Do homework", "Extrainfo","18-11-2015 18:00",3,"17-11-2015 18:00"));
	//ToDoArray.push(new ToDo("Deadline quiz 2", "extra info" , "23-11-2015 20:00",5,"22-11-2015 12:00"));


	/*console.log(ToDoArray[0].toString());
	console.log(ToDo1.getSubject());
	console.log(ToDo1.get)
	console.log(ToDo1.getPriority());
	console.log(ToDo1.getReminderDate());*/

	/*console.log(ToDo2.toString());
	console.log(ToDo2.getDescription());
	console.log(ToDo2.getPriority());
	console.log(ToDo2.getReminderDate());*/

	$("#TodayList,#7DaysList,#MonthList").hide(); //hide all but the allList at start


	// Laat alle Today zien
	$(".TodayButton").on("click","button", function(){

		$("#TodayList").show();
		$("#7DaysList,#MonthList,#AllList").hide();
		console.log(" Today clicked");

	});

	// Laat alle 7Days zien
	$(".7DaysButton").on("click","button", function(){

		$("#7DaysList").show();
		$("#TodayList,#MonthList,#AllList").hide();
		console.log(" 7Days clicked");

	});

	// Laat alle month zien
	$(".MonthButton").last().on("click","button", function(){

		$("#MonthList").show();
		$("#TodayList,#7DaysList,#AllList").hide();
		console.log(" month clicked");
	});

	//Laat alles zien
	$(".EveryButton").last().on("click","button", function(){

		$("#AllList").show();
		$("#TodayList,#7DaysList,#MonthList").hide();
		console.log(" every clicked");

	});


	// Add Task 



	$("#TaskDescIn").on("click", "input", function(){

		var TDIN = $("#TaskDescIn input");

		if( TDIN.val() === "Subject"){
			TDIN.val("");
		}

	});


	$("#ExtraInfoIn").on("click","input",function(){

		if($("#ExtraInfoIn input").val() === "Extra info"){
			$("#ExtraInfoIn input").val("");
		}

	});


	$("#DateIn").on("click","input",function(){

		if($("#DateIn input").val() === "d-m-year"){
			$("#DateIn input").val("");
		}

	});

	// priority
	var prio;

	$(".Groen").on("click","button", function(){
		prio = 1;
	});

	$(".Geel").on("click","button", function(){
		prio = 2;
	});


	$(".Rood").on("click","button", function(){
		prio = 3;
	});


	$("#ReminderIn").on("click","input",function(){

		if($("#ReminderIn input").val() === "d-m-year"){
			$("#ReminderIn input").val("");
		}

	});

	$(".AddButton").on("click", "button", function(){

		console.log(" Add geklikt");
		var desc = $("#TaskDescIn input").val();
		var ExInfo= $("#ExtraInfoIn input").val();

		var da = $("#DateIn input").val();
		var remD = $("#ReminderIn input").val();

		ToDoArray.push(new ToDo(desc,ExInfo,da,prio,remD));

		for ( var i = 0; i < ToDoArray.length; i++){

			console.log(ToDoArray[i].toString());
		}

		sortlist(); //sort list to week, day month every time todo gets added.

		window.alert("ToDo addded");
	});


	function emptyList(){
		var $nameTemp = $("<li>");

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

	function sortlist(){

		emptyList();

		console.log("sorting the following list:");

		for ( var i = 0; i < ToDoArray.length; i++){

			console.log(ToDoArray[i].toString());
		}


		//Get current date:
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1;
		var yy = today.getFullYear();

		console.log("year: " + yy);

		//Sort the list by date:
		for(var i=0;i<ToDoArray.length;i++)
		{
			//in the AllList, all items should be displayed
			var $allTemp = $("<li>");
			$allTemp.text(ToDoArray[i].toString());
			$("#AllList").append($allTemp);



			var temp = ToDoArray[i].getDueDate().split("-"); 
			console.log(temp[0]==dd && temp[2]==yy);
			console.log(temp[0] + " should be equal to: " + dd + " " + temp[2] + " should be equal to: " + yy);

			if(temp[0]==dd && temp[2]==yy) //if day and year matches add to the todaylist
			{
				var $temp = $("<li>");
				$temp.text(ToDoArray[i].toString());
				$("#TodayList").append($temp);
			}
			if(temp[0]>dd && temp[0]<dd+7 && temp[2] == yy)
			{
				var $temp = $("<li>");
				$temp.text(ToDoArray[i].toString());
				$("#7DaysList").append($temp);
			}
			console.log("month: " + temp[1] +" equal to: " + mm );

			if(temp[1]==mm && temp[2]==yy)//if month and year matches add to the monthlist
			{
				var $temp = $("<li>");
				$temp.text(ToDoArray[i].toString());
				$("#MonthList").append($temp);
			}

		}

	};
};



$(document).ready(main);


//Constructor for ToDo
function ToDo(subject,extraInfo,dueDate,priority,reminderDate){
	this.subject = subject;
	this.extraInfo = extraInfo;
	this.dueDate = dueDate;
	this.priority = priority;
	this.reminderDate = reminderDate;

	//Prototype functions for ToDo
	ToDo.prototype.toString = function(){return "ToDo: " + this.subject + ", " + this.extraInfo + ", " + this.dueDate + ", " + this.priority + ", " + this.reminderDate};
	ToDo.prototype.getsubject = function(){return this.subject;};
	ToDo.prototype.getExtraInfo = function(){return this.extrainfo};
	ToDo.prototype.getDueDate = function(){return this.dueDate};
	ToDo.prototype.getPriority = function(){return this.priority;};
	ToDo.prototype.getReminderDate = function(){return this.reminderDate;};
}





