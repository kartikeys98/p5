
function heuristic(a, b) {
	var d = dist(a.i, a.j, b.i, b.j);
	// var d = abs(a.i - b.i) + abs(a.j - b.j);
	return d;
}

function removeFromArray(openSet, current){
	for(var i=openSet.length-1; i>=0; --i){
		if(openSet[i] === current){
			openSet.splice(i, 1);
		}
	}
}

var cols = 50;
var rows = 50;
var grid = new Array(cols);
var openSet = [];
var closedSet = [];
var start;
var end;
var w, h;
var path = [];

function Spot(i, j) {

	this.i = i;
	this.j = j;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.neighbors = [];
	this.previous = undefined;
	this.wall = false;

	if (random(1) < 0.1) {
		this.wall = true;
	}

	this.show = function(col) {
		fill(col);
		if (this.wall) {
			fill(0);
		}
		//stroke(0);
		rect(this.i*w, this.j*h, w-1, h-1);
	}

	this.addNeighbors = function(grid) {
		var i = this.i;
		var j = this.j;
		if (i < cols - 1) {
			this.neighbors.push(grid[i + 1][j]);
		}
		if (i > 0) {
			this.neighbors.push(grid[i - 1][j]);
		}
		if (j < rows - 1) {
			this.neighbors.push(grid[i][j + 1]);
		}
		if (j > 0) {
			this.neighbors.push(grid[i][j - 1]);
		}
		if (i > 0 && j > 0) {
			this.neighbors.push(grid[i - 1][j - 1]);
		}
		if (i < cols - 1 && j > 0) {
			this.neighbors.push(grid[i + 1][j - 1]);
		}
		if (i > 0 && j < rows - 1) {
			this.neighbors.push(grid[i - 1][j + 1]);
		}
		if (i < cols - 1 && j < rows - 1) {
			this.neighbors.push(grid[i + 1][j + 1]);
		}
	}
}

function setup() {
	createCanvas(400, 400);
	console.log('A*');
	w = width / cols;
	h = height / rows;

	for (var i = 0; i < cols; i++) {
		grid[i] = new Array(rows);
	}

	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			grid[i][j] = new Spot(i, j);
		}
	}

	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			grid[i][j].addNeighbors(grid);
		}
	}

	start = grid[0][0];
	end = grid[cols - 1][rows - 1];
	start.wall = false;
	end.wall = false;

	openSet.push(start);
}

function draw() {
	if (openSet.length > 0) {

		var winner = 0;
		for (var i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[winner].f) {
				winner = i;
			}
		}
		var current = openSet[winner];
		if (current === end) {
			noLoop();
			console.log("DONE!");
		}
		removeFromArray(openSet, current);
		closedSet.push(current);

		var neighbors = current.neighbors;
		for (var i = 0; i < neighbors.length; i++) {
			var neighbor = neighbors[i];

			if (!closedSet.includes(neighbor) && !neighbor.wall) {
				var tempG = current.g + heuristic(neighbor, current);
				var newPath = false;
				if (openSet.includes(neighbor)) {
					if (tempG < neighbor.g) {
						neighbor.g = tempG;
						newPath = true;
					}
				} else {
					neighbor.g = tempG;
					newPath = true;
					openSet.push(neighbor);
				}
				if (newPath) {
					neighbor.h = heuristic(neighbor, end);
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.previous = current;
				}
			}

		}
	} else {
		console.log('no solution');
		noLoop();
		return;
	}

	background(0);

	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			grid[i][j].show(color(255));
		}
	}

	for (var i = 0; i < closedSet.length; i++) {
		closedSet[i].show(color(255, 0, 0));
	}

	for (var i = 0; i < openSet.length; i++) {
		openSet[i].show(color(0, 255, 0));
	}

	path = [];
	var temp = current;
	path.push(temp);
	while (temp.previous) {
		path.push(temp.previous);
		temp = temp.previous;
	}

	for (var i = 0; i < path.length; i++) {
		path[i].show(color(0, 0, 255));
	}


}
