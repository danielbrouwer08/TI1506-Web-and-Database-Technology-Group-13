var main = function () {
	"use strict";

	console.log("meh");	
	
	//Constructor for ToDo
	function ToDo(description,dueDate,priority,reminderDate){
		this.description = description;
		this.dueDate = dueDate;
		this.priority = priority;
		this.reminderDate = reminderDate;
	}
	
	
	//Prototype functions for ToDo
	ToDo.prototype.toString = function(){return "ToDo: " + this.description + ", " + this.priority + ", " + this.reminderDate};
	ToDo.prototype.getDescription = function(){return this.reminderDate;};
	ToDo.prototype.getPriority = function(){return this.priority;};
	ToDo.prototype.getReminderDate = function(){return this.reminderDate;};
	
	//Create 2 ToDo objects
	var ToDo1 = new ToDo("Do homework","18-11-2015 18:00",3,"17-11-2015 18:00");
	var ToDo2 = new ToDo("Deadline quiz 2","23-11-2015 20:00",5,"22-11-2015 12:00");
	
	/*
	console.log(ToDo1.toString());
	console.log(ToDo1.getDescription());
	console.log(ToDo1.getPriority());
	console.log(ToDo1.getReminderDate());
	
	console.log(ToDo2.toString());
	console.log(ToDo2.getDescription());
	console.log(ToDo2.getPriority());
	console.log(ToDo2.getReminderDate());
	*/
	
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
	
	
	
	
	
	
	
	
};
$(document).ready(main);