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

function init() {
	for (var i = 0; i < 40; i++) {
		console.log(randomMainDeckID())
	}
	// for (var i = 0; i < 15; i++) {
		// console.log(randomExtraDeckID())
	// }
}