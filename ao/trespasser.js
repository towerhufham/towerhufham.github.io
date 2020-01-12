var messages = [];
var buffer = 10
var place = "outside";
var gun = false;


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

function handleInput(str) {
	console.log(str);
	if (place === "outside" && str === "ready") {
		writeMessage("(When I put something in brackets, that's something this game will respond to if you type it in. If a message disappears and you want to see it again, you'll have to refresh. Sorry.)");
		writeMessage("You muster up all your strength and kick open his door. You walk into his living room, furnished with whatever the fuck people like him have.");
		writeMessage("On his table is a stack of [mail] and his [laptop]. You can walk into his [bedroom].");
		place = "living";
	}
	if (place === "living") {
		if (str === "mail") {
			writeMessage("There are about eight letters addressed to him. I imagine they're full of cash, probably dusted with cocaine. Take every penny.");
		}
		if (str === "laptop") {
			writeMessage("I bet you could search it for hours and not find a damn thing about AvengerOnline. I doubt he even knows what it looks like. Yet, he has it all right there.");
		}
		if (str === "bedroom") {
			writeMessage("In his bedroom is a [bed], a [closet], and a door to his [bathroom].");
			place = "bedroom";
		}
	}
	if (place === "bedroom") {
		if (str === "bed" && !gun) {
			writeMessage("Not yet.");
		}
		if (str === "bed" && gun) {
			writeMessage("You look under the bed. There he is, shivering in fear. You're holding his life in your hand. [Markius].");
			place = "bed";
		}
		if (str === "closet") {
			writeMessage("There's a bag. You know who's in it just as well as I do.");
		}
		if (str === "bathroom") {
			writeMessage("On his sink is a [gun]. I don't know if that's where he really keeps it, but it's where I keep mine.");
			writeMessage("I'll let you back into his [bedroom].");
			place = "bathroom";
		}
	}
	if (place === "bathroom") {
		if (str === "gun") {
			writeMessage("You take the gun. Funny, I was thinking the same thing.");
			gun = true;
		}
		if (str === "bedroom") {
			writeMessage("In his bedroom is a [bed], a [closet], and a door to his [bathroom].");
			place = "bedroom";
		}
	}
	if (place === "bed") {
		if (str === "markius") {
			writeMessage("Remember how in Ultimate Trespasser the enemies were invincible?");
			writeMessage("Yeah, that's where we fucked up.");
			writeMessage("Say [ready] when you're ready to blow his brains all over the floor.");
		}
		if (str === "ready") {
			writeMessage("Yeah, you're ready now. But this is a game. When the time comes, do you think you could do it?");
			writeMessage("Would you try to say a cool line, like you do to show off to your online friends? \"never come here again. i'll shoot you throgh the head.\" I'm sure that'll calm your nerves.");
			writeMessage("Would you pull the fucking trigger, or would you freeze up completely?");
			writeMessage("Surely, as he's demonstrated, killing someone isn't so hard right? You should think about that.");
			writeMessage("I'm dead serious. Pull the fucking [trigger].");
		}
		if (str === "trigger") {
			writeMessage("386 VERNON STREET DAVENPORT, IA 52804.");
			writeMessage("He's always home after 7 PM. Good luck.");
			place = "end";
		}
	}
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
		handleInput(str.trim().toLowerCase());
		return false;
	});
});