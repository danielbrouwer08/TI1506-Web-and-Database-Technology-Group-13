var main = function () {
	"use strict";

	$("#signupDialog").hide(); //hide the dialog HTML

	$(".signup-button button").on("click",function(event){
		showDialog();
	});

	$(".confirm-button button").on("click",function(event){
		if($(".username-input input").val()!== "" && $(".password-input input").val()!== "" && $(".email-input input").val()!== "")
		{
			var username = $(".username-input input").val();
			var password = $(".password-input input").val();
			var email = $(".email-input input").val();

			var user = new userData(username,password,email);

			alert("Account created succesfully. Please check your email for verification");
			closeDialog();
			
			//send data to server
			sendUserData(user);

			//console.log(user.toString());
			//console.log(user.getPassword());
		}else
		{
			alert("Please fill in all inputfields");
		}

	});


};

function sendUserData(user) {
	$.post("/createaccount",user, function(response){
	console.log("Data send");
	console.log(response);
});
}

function closeDialog()
{
	$("#signupDialog").dialog("close");
}

function showDialog()
{
	$("#signupDialog").dialog({
		//width: 600,
		//height: 600,
	});
}

//Constructor for userData
function userData(username,password,email){
	this.username = username;
	this.password = password;
	this.email = email;

	//Prototype functions for userData
	//userData.prototype.toString = function(){return "UserData: " + this.username + ", " + this.email};
	//userData.prototype.getUsername = function(){return this.username;};
	//userData.prototype.getPassword = function(){return this.password;};
	//userData.prototype.getEmail = function(){return this.email;};
}


$(document).ready(main);