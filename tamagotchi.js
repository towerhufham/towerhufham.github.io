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
			var seed = seeds[i];
			var d = distance(seed.x, seed.y, px, py);
			if (d < closest.dist) {
				closest.seed = seed;
				closest.dist = d;
			}
		}
		return closest;
	}
	
	function findFarthestPoints(n, seeds) {
		//returns the n farthest points away from the given seeds
		var points = [];
		for (var i = 0; i < n; i++) {
			var furthest = {};
			furthest.dist = 0;
			furthest.x = null;
			furthest.y = null;
			for (var y = 0; y < 16; y++) {
				for (var x = 0; x < 16; x++) {
					var nearest = closestSeed(x, y, seeds);
					var d = distance(nearest.seed.x, nearest.seed.y, x, y);
					//console.log("d is " + d);
					if (d > furthest.dist) {
						furthest.x = x;
						furthest.y = y;
						furthest.dist = d;
						//console.log("new furthest is " + furthest.dist);
					}
				}
			}
			console.log("furthest found to be " + furthest.dist);
			seeds.push(furthest); //this line may not work
			points.push(furthest);
		}
		return points;
	}
	
	//note: functions initMon() and loadDigimon() are located in digimon_loader.js

	function generateTama(tama1, tama2, numberOfSeeds) {
		var newTama = initMon(16);
		var overlapSeeds = [];
		
		//find pixels common to both sourcetamas
		for (var y = 0; y < 16; y++) {
			for (var x = 0; x < 16; x++) {
				//console.log(x+","+y);
				if (tama1[x][y] === tama2[x][y]) {
					newTama[x][y] = tama1[x][y];
					var s = {};
					s.x = x;
					s.y = y;
					overlapSeeds.push(s);
				}
			}
		}
		
		//find the farthest 2 points
		furthest2 = findFarthestPoints(2, overlapSeeds);
		
		//paint one red, one blue
		newTama[furthest2[0].x][furthest2[0].y] = "red";
		newTama[furthest2[1].x][furthest2[1].y] = "blue";
		
		return newTama;
	}
	
	//for debugging
	function generateVoronoi() {
		var v = initMon(16);
		var seeds = [];
		
		var rseed = {};
		rseed.x = randInt(0,16);
		rseed.y = randInt(0,16);
		rseed.color = "red";
		seeds.push(rseed);
		
		var bseed = {};
		bseed.x = randInt(0,16);
		bseed.y = randInt(0,16);
		bseed.color = "blue";
		seeds.push(bseed);
		
		var rseed2 = {};
		rseed2.x = randInt(0,16);
		rseed2.y = randInt(0,16);
		rseed2.color = "red";
		seeds.push(rseed2);
		
		//fill
		for (var y = 0; y < 16; y++) {
			for (var x = 0; x < 16; x++) {
				v[x][y] = closestSeed(x, y, seeds).seed.color;
			}
		}
		
		//show seeds
		v[rseed.x][rseed.y] = 1;
		v[bseed.x][bseed.y] = 1;
		v[rseed2.x][rseed2.y] = 1;
		
		//draw furthest points from seeds
		var furthests = findFarthestPoints(2, seeds);
		v[furthests[0].x][furthests[0].y] = 0
		v[furthests[1].x][furthests[1].y] = 0
		
		return v;
	}
	
	function drawTama(tama) {
		for (var i = 0; i < 16; i++) 
		{
			for (var j = 0; j < 16; j++) 
			{
				if (tama[i][j] === 1) {
					drawPixel(i,j);
				}
				else if (tama[i][j] === "red") {
					drawPixel(i,j,color="red");
				}
				else if (tama[i][j] === "blue") {
					drawPixel(i,j,color="blue");
				}
			}
		}
	}

	//generate the tama
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
	newMon = generateVoronoi(mon1, mon2);
	drawTama(newMon);
}