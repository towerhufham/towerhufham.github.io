// var xhr = new XMLHttpRequest();
// xhr.open("GET", "https://www.ygohub.com/api/all_cards", false);
// xhr.send()
// var cards = JSON.parse(xhr.response)["cards"]

function getCardList(callback) {
	$.getJSON("https://www.ygohub.com/api/all_cards", function(data) {
		callback(data["cards"]);
	})
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCardName(cards) {
	return cards[randInt(0, cards.length)];
}

function randomMainDeckID(cards, callback) {
	// var card = getCard(randomCardName());
	// while (card["is_extra_deck"]) {
		// card = getCard(randomCardName());
	// }
	// return card["number"]
	getCard(randomCardName(cards), function(card) {
		console.log(card["number"]);
		callback(card["number"]);
	});
}

function getCard(name, callback) {
	// xhr.open("GET", "https://www.ygohub.com/api/card_info?name="+name, false);
	// xhr.send();
	// var data = JSON.parse(xhr.response);
	// return data["card"]
	
	$.getJSON("https://www.ygohub.com/api/card_info?name="+name, function(data) {
		callback(data["card"]);
	});
}

function getRandomID() {
	return getIDFromName(randomCardName())
}

function createDeckContent(cards) {
	var content = "#created by random chance at towerhufham.com\n#main\n";
	for (var i = 0; i < 40; i++) {
		content += randomMainDeckID(cards) + "\n";
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
	// var content = createDeckContent();
	// download("random-deck.ydk", content);
	// testing
	getCardList(function(cards) {
		getCard(randomCardName(cards), function(card){console.log(card);});
		list = [];
		for (var i = 0; i < 40; i++) {
			// randomMainDeckID(cards, function(id){console.log(id);});
			randomMainDeckID(cards, function(id){list.push(id);});
		}
		
		var timeout = setInterval(function() {
			if(list.length >= 40) {
				clearInterval(timeout); 
				console.log(list);
			} 
		}, 100);
		//setTimeout(function() {console.log(list);}, 2000);
	});
}