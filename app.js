var main = function () {
	"use strict";

	// Array met alle todo items.

	var ToDoArray = new Array();
	
	console.log("meh");	
	
	//Create 2 ToDo objects
	ToDoArray.push(new ToDo("Do homework", "Extrainfo","18-11-2015 18:00",3,"17-11-2015 18:00"));
	ToDoArray.push(new ToDo("Deadline quiz 2", "extra info" , "23-11-2015 20:00",5,"22-11-2015 12:00"));
	
	
	/*console.log(ToDoArray[0].toString());
	console.log(ToDo1.getSubject());
	console.log(ToDo1.get)
	console.log(ToDo1.getPriority());
	console.log(ToDo1.getReminderDate());*/
	
	/*console.log(ToDo2.toString());
	console.log(ToDo2.getDescription());
	console.log(ToDo2.getPriority());
	console.log(ToDo2.getReminderDate());*/
	
	
	// Laat alle Today zien
	$(".TodayButton").on("click","button", function(){
		
		$("#TodayList").show();
		$("#7DaysList , #MonthList").hide();
		console.log(" Today clicked");
		
	});
	
	// Laat alle 7Days zien
	$(".7DaysButton").on("click","button", function(){
		
		$("#7DaysList").show();
		$("#TodayList , #MonthList").hide();
		console.log(" 7Days clicked");
		
	});
	
	// Laat alle month zien
	$(".MonthButton").last().on("click","button", function(){
		
		$("#MonthList").show();
		$("#TodayList , #7DaysList").hide();
		console.log(" month clicked");
		
	});
	
	//Laat alles zien
	$(".EveryButton").last().on("click","button", function(){
			
			$("#MonthList , #TodayList , #7DaysList").show();
			
			console.log(" month clicked");
			
	});
	
	
	// Add Task 
	
	
	
	
	$("#TaskDescIn input").val("Subject");
	$("#TaskDescIn").on("click", "input", function(){
		
		var TDIN = $("#TaskDescIn input");
		
		if( TDIN.val() === "Subject"){
			TDIN.val("");
		}
		
	});
	
	
	$("#ExtraInfoIn input").val("Extra info");
	$("#ExtraInfoIn").on("click","input",function(){
		
		if($("#ExtraInfoIn input").val() === "Extra info"){
			$("#ExtraInfoIn input").val("");
		}
		
	});
	
	
	$("#DateIn input").val("d-m-year");
	$("#DateIn").on("click","input",function(){
		
		if($("#DateIn input").val() === "d-m-year"){
			$("#DateIn input").val("");
		}
		
	});
	
	// priority
	
	
	$("#ReminderIn input").val("d-m-year");
	$("#ReminderIn").on("click","input",function(){
		
		if($("#ReminderIn input").val() === "d-m-year"){
			$("#ReminderIn input").val("");
		}
		
	});
	
	$(".AddButton").on("click", "button", function(){
		
		console.log(" Add geklikt");
		var desc = $("#TaskDescIn input").val();
		var ExInfo= $("#ExtraInfoIn input").val();
		var prio = 0; 
		var da = $("#DateIn input").val();
		var remD = $("#ReminderIn input").val();
		
		ToDoArray.push(new ToDo(desc,ExInfo,da,prio,remD));
		
		for ( var i = 0; i < ToDoArray.length; i++){
			
			console.log(ToDoArray[i].toString());
		}
		
		sortlist(); //sort list to week, day month every time todo gets added.
		
		window.alert("ToDo addded");
	});
	
	
function sortlist(){
	
	console.log("sorting the following list:");
	
	for ( var i = 0; i < ToDoArray.length; i++){
		
		console.log(ToDoArray[i].toString());
	}
	

	//Get current date:
	 var today = new Date();
	 var dd = today.getDate();
	 var mm = today.getMonth()+1;
	 var yy = today.getYear();
	
	//Sort the list by date:
	for(var i=0;i<ToDoArray.length;i++)
		{
	
			//var temp = new Array();
		
			//werkt nog niet :HIER VERDER
			
			var temp = ToDoArray[i].getDueDate().split("-"); 
			
			if(temp[0]===dd && temp[2]===yy) //if day and year matches add to the todaylist
				{
					var $temp = $("<li>");
					$temp.text(ToDoArray[i].toString());
					$("#TodayList").append($temp);
				}
			if(temp[0]>dd-3 && temp[0]<dd+4 && temp[2] === yy) //TEMP teststatement needs to be adjusted!!! -> fix: extract weeknumbers
				{
					var $temp = $("<li>");
					$temp.text(ToDoArray[i].toString());
					$("#7DaysList").append($temp);
				}
			if(temp[1]===mm && temp[2]===yy)//if month and year matches add to the monthlist
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





