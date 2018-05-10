/* global $ */
// Check off specific todos by clicking
$("ul").on("click", "li", function(){
	$(this).toggleClass("completed");
});

//Remove todo when X is clicked
$("ul").on("click", "span", function(event){
	$(this).parent().fadeOut(500, function(){
		$(this).remove();
	});
	event.stopPropagation();
});

// //Add new Todo when Enter is pressed from Input
// $("input[type='text']").keypress(function(event){
// 	if(event.which === 13){
// 		//Grabbing new todo text from input
// 		var todoText = $(this).val();
// 		$(this).val("");
// 		//create a new li and add to the ul
// 		$("ul").append("<li><span><i class='fas fa-trash-alt'></i></span> " + todoText + "</li>");
// 	}
// });

$("#toggle-form").click(function(){
	$("input[type='text']").fadeToggle();
});