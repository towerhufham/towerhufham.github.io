// var xhr = new XMLHttpRequest();
// xhr.open("GET", "https://www.ygohub.com/api/all_cards", false);
// xhr.send()
// var cards = JSON.parse(xhr.response)["cards"]

function getCardList(callback) {
	// $.getJSON("https://www.ygohub.com/api/all_cards", function(data) {
		// callback(data["cards"]);
	// })
	
	return new Promise((resolve, reject) => {
		$.getJSON("https://www.ygohub.com/api/all_cards", function(data) {
			resolve(data["cards"]);
		})
	});
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCardName(cards) {
	return cards[randInt(0, cards.length)];
}

function randomMainDeckID(cards) {
	// var card = getCard(randomCardName());
	// while (card["is_extra_deck"]) {
		// card = getCard(randomCardName());
	// }
	// return card["number"]
	return new Promise((resolve, reject) => {
		// getCard(randomCardName(cards), function(card) {
			// console.log(card["number"]);
			// callback(card["number"]);
		// });
		//this syntax is basically the long way of using "await". This is helpful: https://stackoverflow.com/questions/46159415/await-promises-all-syntaxerror
		var card = getCard(randomCardName(cards)).then((card) => resolve(card["number"]));
	});
}

function getCard(name) {
	// xhr.open("GET", "https://www.ygohub.com/api/card_info?name="+name, false);
	// xhr.send();
	// var data = JSON.parse(xhr.response);
	// return data["card"]
	
	// $.getJSON("https://www.ygohub.com/api/card_info?name="+name, function(data) {
		// callback(data["card"]);
	// });
	
	return new Promise((resolve, reject) => {
		$.getJSON("https://www.ygohub.com/api/card_info?name="+name, function(data) {resolve(data["card"]);})
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

async function createDeckContent() {
	var cards = await getCardList();
	var list = [];
	for (var i = 0; i < 40; i++) {
		var id = await randomMainDeckID(cards);
		list.push(id);
	}
	console.log(list);
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
	// getCardList(function(cards) {
		// getCard(randomCardName(cards), function(card){console.log(card);});
		// list = [];
		// for (var i = 0; i < 40; i++) {
			// randomMainDeckID(cards, function(id){list.push(id);});
		// }
		
		// var timeout = setInterval(function() {
			// if(list.length >= 40) {
				// clearInterval(timeout); 
				// console.log(list);
			// } 
		// }, 100);
	// });
	
	//testing 2
	createDeckContent();
	
	//async kiddie-pool
	// function getTextSlowly(text) {
		// return new Promise((resolve, reject) => {
			// setTimeout(function() {resolve(text+"...");}, 2000);
		// });
	// }
	// async function doIt() {
		// var p = await getTextSlowly("did it work?");
		// console.log(p);
	// }
	// doIt();
}