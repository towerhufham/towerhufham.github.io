function randInt(min, max) {
	//todo: implement seeding
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

function getRelatedCards(card) {
	//this function returns a list of related cards to search for later
	//this regex gets all text withtin (and including) quotes, which is used in card text to refer to archeytpes and specific cards
	var matches = card["text"].match(/"(.*?)"/g);
	var related  = [];
	console.log("Found these quotes: "+matches);
	//if there were any quotes
	if (matches) {
		console.log("matches == true, length of matches is "+matches.length);
		for (var i = 0; i < matches.length; i++) {
			//remove the quotes from the match
			console.log("The current match: "+matches[i]);
			var match = matches[i].replace(/"/g, "");
			//if remove "(s)" from the match
			console.log("Then: "+match);
			var match = match.replace(/\(s\)/g, "");
			console.log("Then: "+match);
			//cards refer to themselves within quotes, which we don't want
			//tokens are also referred to with quotes, which we don't want either
			if (match != card["name"] && !(match.includes("Token"))) {
				console.log("Pushing "+match);
				related.push(match);
			}
			if (match == card["name"]) {
				console.log("didn't push because it's == to it's name, "+card["name"]);
			}
		}
	}
	//remove all duplicate references by converting to a set and back
	related = Array.from(new Set(related));
	return related;
}

function isValid(card) {
	//check if card even exists
	if (!(typeof card === "undefined")) {
		//check if card is main deck and has an id
		if (!(card["is_extra_deck"] || isNaN(card["number"]))) {
			//check legality
			if (card["legality"]["TCG"]["Advanced"] != "Forbidden" || card["legality"]["OCG"]["Advanced"] != "Forbidden") {
				return true;
			}
		}
	}
	return false;
}

async function randomMainDeckID(cards) {
	var card = await randomCard(cards);
	while (!(isValid(card))) {
		card = await randomCard(cards);
	}
	
	//check for related cards
	var related = getRelatedCards(card);
	
	return {id:card["number"], related:related};
}
	
function getNamesContaining(cards, substring) {
	names = [];
	for (var i = 0; i < cards.length; i++) {
		if (cards[i].includes(substring)) {
			names.push(cards[i]);
		}
	}
	return names;
}
	
async function randomRelatedCard(cards, related) {
	var names = getNamesContaining(cards, related);
	if (names.length > 0) {
		var name = names[randInt(0, names.length)];
		removeValue(names, name);
		var card = await getCard(name);
		//try every name until one is valid
		while (!(isValid(card))) {
			if (names.length > 0) {
				var name = names[randInt(0, names.length)];
				removeValue(names, name);
				var card = await getCard(name);
			} else {
				//if we get here, we've exhausted all possibilities
				console.log("Exhausted all possibilities");
				break;
			}
		}
		if (isValid(card)) {
			console.log("Searched for "+related+", got "+card["name"]+", id="+card["number"]+".");
			var newRelated = getRelatedCards(card);
			return {id:card["number"], related:newRelated};
		}
	}
	//for now, if the card is invalid just call it a loss and get a random card. TODO make this better maybe?
	console.log("Searched for "+related+", couldn't find anything valid.");
	return randomMainDeckID(cards);
}
	
function getCard(name) {
	return new Promise((resolve, reject) => {
		$.getJSON("https://www.ygohub.com/api/card_info?name="+name, function(data) {
			resolve(data["card"]);
		})
	});
}

function removeValue(arr, val) {
	var index = arr.indexOf(val);
	if (index > -1) {
		arr.splice(index, 1);
	}
	return arr;
}

async function createDeckContent() {
	//init
	var cards = await getCardList();
	var decklist = new Array(40).fill(null);
	//this magically makes a list of 0 to 40
	var avalibleSlots = [...Array(40).keys()]
	
	//fill decklist with ids
	for (var i = 0; i < 40; i++) {
		if (decklist[i] == null) {
			//get card id
			var card = await randomMainDeckID(cards);
			var id = card.id;
			//write the id to this slot
			decklist[i] = id;
			//this slot is no longer avalible
			removeValue(avalibleSlots, i);
			//put the related words in random unused spots in the decklist
			var related = card.related;
			if (related) {
				for (var j = 0; j < related.length; j++) {
					console.log("Found related cards: "+related);
					var index = avalibleSlots[randInt(0, avalibleSlots.length)]
					removeValue(avalibleSlots, index);
					decklist[index] = related[j];
				}
			}
		//if decklist[i] is text, search for it in related cards
		} else if (isNaN(decklist[i])) {
			//get related card
			console.log("Looking for related cards, i="+i+".");
			var card = await randomRelatedCard(cards, decklist[i]);
			//write the id to this slot (don't have to remove from avalibleSlots because it has already been remove)
			decklist[i] = card.id;
			//put the related words in random unused spots in the decklist, the same as above
			var related = card.related;
			if (related) {
				for (var j = 0; j < related.length; j++) {
					console.log("Found related cards: "+related);
					var index = avalibleSlots[randInt(0, avalibleSlots.length)]
					removeValue(avalibleSlots, index);
					decklist[index] = related[j];
				}
			}
		}
		console.log("Current decklist: "+decklist);
	}
	//create content string
	var content = "#created by random chance at towerhufham.com\n#main\n";
	for (var i = 0; i < 40; i++) {
		content += decklist[i] + "\n";
	}
	return content;
}

function setDownloadHref(filename, text) {
	var element = document.getElementById("deck-button");
	element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
	element.setAttribute("download", filename);
	var img = document.getElementById("download-img");
	img.src = "img/yugioh_download.png";
}

function init() {	
	createDeckContent().then((content) => {
		console.log(content);
		setDownloadHref("random-deck.ydk", content);
	});
}