var main = function () {
	"use strict";
	
	$.getJSON("/todosAmount", function (res) {
		appendRes(res,".todos_amount_list");
	});

	$.getJSON("/getTags", function (res) {
		appendRes(res,".user_defined_tags_list");
	});

	$.getJSON("/tagsFrequency", function (res) {
		appendRes(res,".tag_frequency_list");
	});

	$.getJSON("/totalPendingAndCompleted", function (res) {
		appendRes(res,".total_pending_completed_list");
	});
	
	$.getJSON("/totalPendingAndCompleted", function (res) {
		appendRes(res,".total_pending_completed_list");
	});
	
	$.getJSON("/todosCompletedEachWeek", function (res) {
		appendRes(res,".todos_completed_each_week_list");
	});
	
	$.getJSON("/averageCompletionTime", function (res) {
		appendRes(res,".average_completion_time_list");
	});
	
	$.getJSON("/lowerThenAverageCompletionTime", function (res) {
		appendRes(res,".lower_then_average_completion_time_list");
	});

}


//append json res to the correct class
function appendRes(res,name)
{
	for (var i = 0; i < res.length; i++) {
			var $temp = $("<li>");
			$temp.text(JSON.stringify(res[i]));
			$(name).append($temp);
		}
};


$(document).ready(function () {
	main();
});