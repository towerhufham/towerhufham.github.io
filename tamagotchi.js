var canvas = document.getElementById("digiCanvas");
var ctx = canvas.getContext("2d");

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function proceduralDigimon() {
	
	function drawPixel(x, y, color="black") {
		if (color === "black") {
			ctx.fillStyle="#000000";
		}
		else if (color === "red") {
			ctx.fillStyle="#FFAAAA";
		}
		else if (color === "blue") {
			ctx.fillStyle="#AAAAFF";
		}
		ctx.fillRect(x*18, y*18, 18, 18);
	}

	function distance(x0, y0, x1, y1) {
		return Math.sqrt((x0-x1)**2 + (y0-y1)**2);
	}
	
	function closestSeed(px, py, seeds) {
		closest = {};
		closest.seed = null;
		closest.dist = 999;
		for (var i = 0; i < seeds.length; i++) {
			var seed = seeds[i]
			var d = distance(seed.x, seed.y, px, py);
			if (d < closest.dist) {
				closest.seed = seed;
				closest.dist = d;
			}
		}
		return closest;
	}
	
	function voronoi(seeds) {
		//seed should be a list of objects with 
		//seed.x, seed.y, seed.color
		for (var y = 0; y < 16; y++) {
			for (var x = 0; x < 16; x++) {
				var closest = closestSeed(x, y, seeds);
				//paint pixel
			}
		}
	}
	
	//note: functions initMon() and loadDigimon() are located in digimon_loader.js

	function getRandomWhitePixel(digimon) {
		var x = randInt(0,17);
		var y = randInt(0,17);
		while (digimon[x][y] == 1) {
			var x = randInt(0,17);
			var y = randInt(0,17);
		}
		var white = {};
		white.x = x;
		white.y = y;
		return white;
	}

	function generateTama(tama1, tama2, numberOfSeeds) {
		var newTama = initMon(16);
	}
	
	function generateDigimon(mon1, mon2, SEEDS=2) {
		// init
		var completed = false;
		var newMon = initMon(18);
	  
		//find pixels common to both sourcemons
		for (var y = 0; y < 18; y++) {
			for (var x = 0; x < 18; x++) {
				if (mon1[x][y] === mon2[x][y]) {
					newMon[x][y] = mon1[x][y];
				}
			}
		}
	  
		//randomly seed with colors
		for (var i = 0; i < SEEDS; i++)
		{
			var white = getRandomWhitePixel(newMon);
			newMon[white.x][white.y] = "red";
			var white = getRandomWhitePixel(newMon);
			newMon[white.x][white.y] = "blue";
		}
	  
		//debug:
		//return newMon
	  
		//spread colors until the digimon has no white
		var NUMBER_OF_TRIES = 10;
		for (var t = 0; t < NUMBER_OF_TRIES; t++)
		{
			//find pixels to change
			var newpixels = [];
			var wcount = 0;
			for (var y = 0; y < 18; y++)
			{
				for (var x = 0; x < 18; x++) 
				{
					if (newMon[x][y] === 0)
					{
						wcount++;
						var c = chooseColorByBoundary(newMon, x, y);
						if (c != null) {
							var pix = {}
							pix.x = x;
							pix.y = y;
							pix.c = c;
							newpixels.push(pix);
						}
					}
				}
			}
		
			//actually change the pixels
			for (var i = 0, len = newpixels.length; i < len; i++) {
				var thispix = newpixels[i];
				newMon[thispix.x][thispix.y] = thispix.c;
			}
		
			//end if all white is gone
			if (wcount === 0) {
				completed = true;
				break;
			}
		}
	  
		//if we got to this point but there are still white pixels, just leave them white
	  
		//convert the colors to their proper pixels
		for (var y = 0; y < 18; y++)
		{
			for (var x = 0; x < 18; x++) 
			{
				if (newMon[x][y] === "red") {newMon[x][y] = mon1[x][y];}
				else if (newMon[x][y] === "blue") {newMon[x][y] = mon2[x][y];}
			}
		}
	  
		return newMon;
	}
	
	function chooseColorByBoundary(digimon, x, y) {
		var rcount = 0;
		var bcount = 0;
		
		//get adjacent pixels
		if (x > 0) {
			if (digimon[x-1][y] === "red") {
				rcount++;
			} else if (digimon[x-1][y] === "blue") {
				bcount++;
			}
		}
	  
		if (x < 17) {
			if (digimon[x+1][y] === "red") {
				rcount++;
			} else if (digimon[x+1][y] === "blue") {
				bcount++;
			}
		}
	  
		if (y > 0) {
			if (digimon[x][y-1] === "red") {
				rcount++;
			} else if (digimon[x][y-1] === "blue") {
				bcount++;
			}
		}
	  
		if (y < 17) {
			if (digimon[x][y-1] === "red") {
				rcount++;
			} else if (digimon[x][y+1] === "blue") {
				bcount++;
			}
		}
	  
		//if there are no adjacent colored pixels, wait until there are
		if (rcount === 0 && bcount === 0) {
			return null;
		}
		  
		//if there is a majority, return that
		else 
		{
			if (rcount > bcount) {return "red";}
			else if (rcount < bcount) {return "blue";}
		
			// if it's a tie, choose randomly
			else if (rcount === bcount) {
				if (randInt(0,1) === 0) {return "red";}
				else {return "blue";}
			}
		}
	}
	
	function drawDigimon(digimon) {
		for (var i = 0; i < 18; i++) 
		{
			for (var j = 0; j < 18; j++) 
			{
				if (digimon[i][j] === 1) {
					drawPixel(i,j);
				}
				else if (digimon[i][j] === "red") {
					drawPixel(i,j,color="red");
				}
				else if (digimon[i][j] === "blue") {
					drawPixel(i,j,color="blue");
				}
			}
		}
	}
	
	//generate the digimon
	ctx.fillStyle="#FFFFFF";
	ctx.fillRect(0,0,324,324);
	
	var numberOfMons = 44;
	seed1 = randInt(0,numberOfMons);
	seed2 = randInt(0,numberOfMons);

	while (seed1 === seed2) {
		seed1 = randInt(0,numberOfMons);
		seed2 = randInt(0,numberOfMons);
	}

	mon1 = loadDigimon(seed1);
	mon2 = loadDigimon(seed2);
	newMon = generateDigimon(mon1, mon2);
	drawDigimon(newMon);
}