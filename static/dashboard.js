var main = function () {
	"use strict";
	
	$.get("/todosAmount", function (res) {
		$(".data").append(res);
	});

	$.get("/getTags", function (res) {
		console.log(res);
		$(".data").append(res);
	});

	$.get("/tagsFrequency", function (res) {
		$(".data").append(res);
	});

	$.get("/totalPendingAndCompleted", function (res) {
		$(".data").append(res);
	});
	
	$.get("/totalPendingAndCompleted", function (res) {
		$(".data").append(res);
	});
	
	$.get("/todosCompletedEachWeek", function (res) {
		$(".data").append(res);
	});
	
	$.get("/averageCompletionTime", function (res) {
		$(".data").append(res);
	});
	
	$.get("/lowerThenAverageCompletionTime", function (res) {
		$(".data").append(res);
	});

}


//append json res to the correct class (NOT USED ANYMORE REPLACED WITH EJS)
// function appendRes(res,name)
// {
// 	for (var i = 0; i < res.length; i++) {
// 			var $temp = $("<li>");
// 			$temp.text(JSON.stringify(res[i]));
// 			$(name).append($temp);
// 		}
// };


$(document).ready(function () {
	main();
});