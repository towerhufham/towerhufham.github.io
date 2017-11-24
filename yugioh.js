function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCardName(cards) {
	return cards[randInt(0, cards.length)];
}

function getCardList() {
	return new Promise((resolve, reject) => {
		$.getJSON("https://www.ygohub.com/api/all_cards", function(data) {
			resolve(data["cards"]);
		})
	});
}

function randomCard(cards) {
	//NOTE: sometimes returns undefined, I suspect it's an issue with the ygohub api.
	return new Promise((resolve, reject) => {
		//this syntax is basically the long way of using "await". This is helpful: https://stackoverflow.com/questions/46159415/await-promises-all-syntaxerror
		var card = getCard(randomCardName(cards)).then((card) => resolve(card));
	});
}

async function randomMainDeckID(cards) {
	function isValid(card) {
		if (!(typeof card === "undefined")) {
			if (!(card["is_extra_deck"] || isNaN(card["number"]))) {
				return true;
			}
		}
		return false;
	}
	var card = await randomCard(cards);
	while (!(isValid(card))) {
		card = await randomCard(cards);
	}
	return card["number"]
}
	
function getCard(name) {
	return new Promise((resolve, reject) => {
		$.getJSON("https://www.ygohub.com/api/card_info?name="+name, function(data) {
			resolve(data["card"]);
		})
	});
}

async function createDeckContent() {
	var cards = await getCardList();
	var content = "#created by random chance at towerhufham.com\n#main\n";
	for (var i = 0; i < 40; i++) {
		var id = await randomMainDeckID(cards);
		content += id + "\n";
	}
	return content;
}

function setDownloadHref(filename, text) {
	var element = document.getElementById("deck-button");
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
}

function init() {
	createDeckContent().then((content) => {
		console.log(content);
		setDownloadHref("random-deck.ydk", content);
	});
}