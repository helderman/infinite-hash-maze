const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

(window.onresize = function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
})();

let currentX = 33322;
let currentY = 35273;
let step = 1;
let boxSize = 16;
let walls = true;

const fillBatchSize = 10000;
let fillCount, fillIndex, fillQueue;
initFill();

window.onkeydown = function(e) {
	switch (e.keyCode) {
		case 37: currentX -= step; break;	// left
		case 38: currentY += step; break;	// up
		case 39: currentX += step; break;	// right
		case 40: currentY -= step; break;	// down
		case 65: boxSize *= 1.125; break;	// A = zoom in
		case 90: boxSize /= 1.125; break;	// Z = zoom out
		case 67: initFill(); break;		// C = clear flood fill
		case 70: floodFill(); break;		// F = flood fill
		case 87: walls = !walls; break;		// W = toggle walls
		case 72: toggleDialog('help'); break;	// H = toggle help
		case 73: toggleDialog('info'); break;	// I = toggle info
	}
	step = 16 / boxSize;
};

let lastTime = 0;

(function loop(time) {
	requestAnimationFrame(loop);

	const wallThickness = boxSize * 0.25;
	const fillThickness = boxSize;
	const halfBoxesX = (canvas.width + wallThickness) / boxSize / 2;
	const halfBoxesY = (canvas.height + wallThickness) / boxSize / 2;
	const fromX = Math.floor(currentX - halfBoxesX);
	const toX = Math.ceil(currentX + halfBoxesX);
	const startX = canvas.width / 2 - (currentX - fromX) * boxSize;
	const fromY = Math.floor(currentY - halfBoxesY);
	const toY = Math.ceil(currentY + halfBoxesY);
	const startY = canvas.height / 2 + (currentY - fromY) * boxSize;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.lineWidth = fillThickness;
	ctx.strokeStyle = 'green';
	ctx.lineCap = 'square';
	ctx.beginPath();
	for (let cellY = fromY, y = startY; cellY < toY; cellY++, y -= boxSize) {
		const rowFillIndex = fillIndex[cellY];
		if (rowFillIndex) {
			for (let cellX = fromX, x = startX; cellX < toX; cellX++, x += boxSize) {
				if (cellX in rowFillIndex) {
					ctx.moveTo(x + boxSize/2, y - boxSize/2);
					ctx.lineTo(x + boxSize/2, y - boxSize/2);
				}
			}
		}
	}
	ctx.stroke();

	if (walls) {
		ctx.lineWidth = wallThickness;
		ctx.strokeStyle = 'black';
		ctx.lineCap = 'round';
		ctx.beginPath();
		for (let cellY = fromY, y = startY; cellY < toY; cellY++, y -= boxSize) {
			for (let cellX = fromX, x = startX; cellX < toX; cellX++, x += boxSize) {
				if (wallSouthOf(cellX, cellY)) {
					ctx.moveTo(x, y);
					ctx.lineTo(x + boxSize, y);
				}
				if (wallWestOf(cellX, cellY)) {
					ctx.moveTo(x, y);
					ctx.lineTo(x, y - boxSize);
				}
			}
		}
		ctx.stroke();
	}

	const duration = time - lastTime;
	setInfo('center', Math.floor(currentX) + ', ' + Math.floor(currentY));
	setInfo('cells', (toX - fromX) + ' x ' + (toY - fromY));
	setInfo('hashes', (toX - fromX) * (toY - fromY) * 2);
	setInfo('filled', fillCount);
	setInfo('fps', duration ? (1000 / duration).toFixed(2) : '');
	lastTime = time;
})(lastTime);

function wallSouthOf(x, y) {
	return parity(563 * x + 761 * y);
}

function wallWestOf(x, y) {
	return parity(1409 * x + 397 * y);
}

function wallNorthOf(x, y) {
	return wallSouthOf(x, y+1);
}

function wallEastOf(x, y) {
	return wallWestOf(x+1, y);
}

function parity(n) {
	n ^= n >> 8;
	n ^= n >> 4;
	n ^= n >> 2;
	n ^= n >> 1;
	return n & 1;
}

function initFill() {
	fillCount = 0;
	fillIndex = {};
	fillQueue = [];
}

function floodFill() {
	if (fillCount == 0) {
		addToFill(Math.floor(currentX), Math.floor(currentY));
	}
	for (let count = 0; count < fillBatchSize; count++) {
		let cell = fillQueue.shift();
		if (!wallNorthOf(cell.x, cell.y)) {
			addToFill(cell.x, cell.y+1);
		}
		if (!wallEastOf(cell.x, cell.y)) {
			addToFill(cell.x+1, cell.y);
		}
		if (!wallSouthOf(cell.x, cell.y)) {
			addToFill(cell.x, cell.y-1);
		}
		if (!wallWestOf(cell.x, cell.y)) {
			addToFill(cell.x-1, cell.y);
		}
	}
}

function addToFill(x, y) {
	if (!(y in fillIndex)) {
		fillIndex[y] = {};
	}
	if (!(x in fillIndex[y])) {
		fillCount++;
		fillIndex[y][x] = 0;
		fillQueue.push({x:x, y:y});
	}
}

function toggleDialog(id) {
	let style = document.getElementById(id).style;
	style.display = style.display == 'none' ? 'block' : 'none';
}

function setInfo(id, text) {
	document.getElementById('info_' + id).innerText = text;
}
