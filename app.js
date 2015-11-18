var main = function () {
	"use strict";

	console.log("meh");	
	
	//Constructor for ToDo
	function ToDo(description,dueDate,priority,reminderDate){
		this.description = description;
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
	
	console.log(ToDo1.toString());
	console.log(ToDo1.getDescription());
	console.log(ToDo1.getPriority());
	console.log(ToDo1.getReminderDate());
	
	console.log(ToDo2.toString());
	console.log(ToDo2.getDescription());
	console.log(ToDo2.getPriority());
	console.log(ToDo2.getReminderDate());

};
$(document).ready(main);