var xhr = new XMLHttpRequest();
xhr.open("GET", "https://www.ygohub.com/api/all_cards", false);
xhr.send()
var cards = JSON.parse(xhr.response)["cards"]

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCardName() {
	return cards[randInt(0, cards.length)];
}

function randomMainDeckID() {
	var card = getCard(randomCardName());
	while (card["is_extra_deck"]) {
		//console.log("found an extra deck card, retrying")
		card = getCard(randomCardName());
	}
	return card["number"]
}

function randomExtraDeckID() {
	var card = getCard(randomCardName());
	while (!(card["is_extra_deck"])) {
		//console.log("found a main deck card, retrying")
		card = getCard(randomCardName());
	}
	return card["number"]
}

function getCard(name) {
	xhr.open("GET", "https://www.ygohub.com/api/card_info?name="+name, false);
	xhr.send();
	var data = JSON.parse(xhr.response);
	return data["card"]
}

function getRandomID() {
	return getIDFromName(randomCardName())
}

function createDeckContent() {
	var content = "#created by random chance at towerhufham.com\n#main\n";
	for (var i = 0; i < 40; i++) {
		content += randomMainDeckID() + "\n";
	}
	return content;
}

// from https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

function init() {
	var content = createDeckContent();
	// uriContent = "data:application/octet-stream," + encodeURIComponent(content);
	// location.href = uriContent
	download("random-deck.ydk", content);
}