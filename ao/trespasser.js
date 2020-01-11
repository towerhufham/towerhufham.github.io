var messages = [];
var buffer = 10

function writeMessage(m) {
	if (messages.length >= buffer) {
		messages.shift();
	}
	messages.push(m);
	renderMessages();
}

function renderMessages() {
	var s = "";
	messages.forEach(m => s = (s + m + "\n\n"));
	$("#main").text(s);
}

//mainloop
$(document).ready(function() {
	$("#playerInput").focus();
	writeMessage("You found it.");
	writeMessage("After what happened, I couldn't sleep for days. All I could do was try to figure out where we fucked up. I think it might have been here.");
	writeMessage('We made this game, "Ultimate Trespasser", that kicked off our whole "careers". I decided it could use a bit of fixing up.');
	writeMessage("I'll let you be the judge of how we should go from here. Type \"ready\" when you're ready.")
	
	$("#form").submit(function() {
		var str = $("#playerInput").val();
		writeMessage("> " + str);
		$("#playerInput").val("");
		return false;
	});
});