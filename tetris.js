const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const canvasNext = document.getElementById('next');
const ctxNext = canvasNext.getContext('2d');

const canvasHold = document.getElementById('hold');
const ctxHold = canvasHold.getContext('2d');

context.scale(20, 20);
ctxNext.scale(10, 10);
ctxHold.scale(10, 10);

function arenaSweep() {
	holded = false;
	let rowCount = 1;
	outer: for (let y = arena.length - 1; y > 0; --y) {
		for (let x = 0; x < arena[y].length; ++x) {
			if (arena[y][x] === 0) {
				continue outer;
			}
		}

		const row = arena.splice(y, 1)[0].fill(0);
		arena.unshift(row);
		++y;

		player.score += rowCount * 10;
		rowCount *= 2;
	}
}

function collide(arena, player) {
	const [m, o] = [player.matrix, player.pos];
	for (let y = 0; y < m.length; ++y) {
		for (let x = 0; x < m[y].length; ++x) {
			if (m[y][x] !== 0 &&
				(arena[y + o.y] &&
				arena[y + o.y][x + o.x]) !== 0) {
				return true;
			}
		}
	}
	return false;
}

function collideGhost(arena, ghost) {
	const [m, o] = [ghost.matrix, ghost.pos];
	for (let y = 0; y < m.length; ++y) {
		for (let x = 0; x < m[y].length; ++x) {
			if (m[y][x] !== 0 &&
				(arena[y + o.y] &&
				arena[y + o.y][x + o.x]) !== 0) {
				return true;
			}
		}
	}
	return false;
}

function createMatrix(w,h) {
	const matrix = [];
	while (h--) {
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}

function createPiece(type) {
	if (type === 'T') {
		return [
			[0, 1, 0],
			[1, 1, 1],
			[0, 0, 0],
		]
	} else if (type === 'O') {
		return [
			[2, 2],
			[2, 2],
		]
	} else if (type === 'L') {
		return [
			[0, 0, 3],
			[3, 3, 3],
			[0, 0, 0],
		]
	} else if (type === 'J') {
		return [
			[4, 0, 0],
			[4, 4, 4],
			[0, 0, 0],
		]
	} else if (type === 'I') {
		return [
			[0, 0, 0, 0],
			[5, 5, 5, 5],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		]
	} else if (type === 'S') {
		return [
			[0, 6, 6],
			[6, 6, 0],
			[0, 0, 0],
		]
	} else if (type === 'Z') {
		return [
			[7, 7, 0],
			[0, 7, 7],
			[0, 0, 0],
		]
	}
}


function createGhost(matrix) {
	var arr = [];

	for (var i = 0; i < matrix.length; i++)
	    arr[i] = matrix[i].slice();
	for (let i = 0; i < arr.length; i++){
	    for (let j = 0; j < arr[0].length; j++){
	        if (arr[i][j] > 0){
	            arr[i][j] = 0 - arr[i][j];
	        }
	    }
	}
	return arr;
}

function draw() {
	drawArena(arena, context);
	drawMatrix(arena, {x:0, y:0});
	drawMatrix(player.matrix, player.pos);
	drawGhost(ghost.matrix, ghost.pos);
}

function drawArena(matrix, ctx){
	matrix.forEach((row, y) => {
		row.forEach((value,x) => {
			ctx.lineWidth = "0.05";
			ctx.strokeStyle = "#292929";
			ctx.strokeRect(x, y, 1, 1);
			if ((x+y)%2 == 0) {
				ctx.fillStyle = '#2B2B2B';
			} else {
				ctx.fillStyle = '#2F2F2F';
			}
			ctx.fillRect(x, y, 1, 1);
		});
	});
}

function drawMatrix(matrix, offset){
	matrix.forEach((row, y) => {
		row.forEach((value,x) => {
			if (value > 0) {
				context.fillStyle = colors[value];
				context.fillRect(x + offset.x, y + offset.y, 1, 1);
				context.lineWidth = "0.04";
				context.strokeStyle = "#292929";
				context.strokeRect(x + offset.x, y + offset.y, 1, 1);
			}
		});
	});
}

function drawGhost(matrix, offset){
	var run = true;
	ghost.pos.x = player.pos.x;
	ghost.pos.y = player.pos.y;
	while(run) {
		ghost.pos.y++;
		if (collideGhost(arena, ghost)) {
			ghost.pos.y--;
			run = false;
		}
	}
	matrix.forEach((row, y) => {
		row.forEach((value,x) => {
			if (value < 0) {
				context.lineWidth = "0.04";
				context.strokeStyle = "#dddddd";
				context.strokeRect(x + offset.x, y + offset.y, 1, 1);
				value = 0;
			}
		});
	});
}

function drawNext(cycle, index) {
	drawArena(nextMat, ctxNext);
	var k;
	for (k=0; k<5; k++){
		nextPiece = createPiece(cycle[index+k+1]);
		nextPiece.forEach((row, y) => {
			row.forEach((value,x) => {
				if (value > 0) {
					ctxNext.fillStyle = colors[value];
					ctxNext.fillRect(x + 1, y + 4*k + 1, 1, 1);
					ctxNext.lineWidth = "0.04";
					ctxNext.strokeStyle = "#292929";
					ctxNext.strokeRect(x + 1, y + 4*k + 1, 1, 1);
				}
			});
		});
	}
	
}

function drawHold() {
	drawArena(holdMat, ctxHold);
	holdPiece.forEach((row, y) => {
		row.forEach((value,x) => {
			if (value > 0) {
				ctxHold.fillStyle = colors[value];
				ctxHold.fillRect(x+1,y+1, 1, 1);
				ctxHold.lineWidth = "0.04";
				ctxHold.strokeStyle = "#292929";
				ctxHold.strokeRect(x+1, y+1, 1, 1);
			}
		});
	});
}

function merge(arena, player) {
	player.matrix.forEach((row, y) => {
		row.forEach((value,x) => {
			if (value !== 0) {
				arena[y + player.pos.y][x + player.pos.x] = value;
			}
		});
	});
}

function playerDrop() {
	player.pos.y++;
	if (collide(arena, player)) {
		player.pos.y--;
		merge(arena, player);
		playerReset();
		arenaSweep();
		updateScore();
	}
	dropCounter = 0;
}

function playerHardDrop() {
	var run = true;
	while(run) {
		player.pos.y++;
		if (collide(arena, player)) {
		run = false;
		player.pos.y--;
		merge(arena, player);
		playerReset();
		arenaSweep();
		updateScore();
	}
	dropCounter = 0;
	}
	
}

function playerMove(dir) {
	player.pos.x += dir;
	if (collide(arena, player)) {
		player.pos.x -= dir;
	}
}

function pieceCycle(pieces) {
	var cycle = ''
	while (pieces !== '') {
		p = pieces.length * Math.random() | 0;
		cycle += pieces[p];
		pieces = pieces.replace(pieces[p],'')
	}
	return cycle;
}

var index = 0;
cycle2 = pieceCycle('ILJOTSZ');
cycle1 = cycle2;
cycle2 = pieceCycle('ILJOTSZ');
cycle = cycle1 + cycle2;

function playerReset() {
	player.matrix = createPiece(cycle[index]);
	ghost.matrix = createGhost(player.matrix);
	drawNext(cycle, index);
	index++;
	if (index == 7) {
		lastPiece = createPiece(cycle[index-1])
		cycle1 = cycle2;
		cycle2 = pieceCycle('ILJOTSZ');
		cycle = cycle1 + cycle2;
		index = 0;
	}

	player.pos.y = 0;
	player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
	if (collide(arena, player)) {
		arena.forEach(row => row.fill(0));
		index = 0;
		cycle2 = pieceCycle('ILJOTSZ');
		cycle1 = cycle2;
		cycle2 = pieceCycle('ILJOTSZ');
		cycle = cycle1 + cycle2;
		player.matrix = createPiece(cycle[index]);
		ghost.matrix = createGhost(player.matrix);
		drawNext(cycle, index);
		index++;
		player.score = 0;
		holdPiece = null;
		drawHold();
		updateScore();
	}

}

function playerRotate(dir) {
	const pos = player.pos.x;
	let offset = 1;
	rotate(player.matrix, dir);
	ghost.matrix = createGhost(player.matrix);
	while (collide(arena, player)) {
		player.pos.x += offset;
		offset = -(offset + (offset > 0 ? 1 : -1));
		if (offset > player.matrix[0].length) {
			rotate(player.matrix, -dir);
			ghost.matrix = createGhost(player.matrix);
			player.pos.x = pos;
			return;
		}
	}
}

var holdPiece = null;
function playerHold() {
	if (holdPiece == null) {
		if (index == 0) {
			holdPiece = lastPiece;
		} else {
			holdPiece = createPiece(cycle[index-1]);
		}
		player.matrix = createPiece(cycle[index]);
		ghost.matrix = createGhost(player.matrix);
	} else {
		player.matrix = holdPiece;
		ghost.matrix = createGhost(player.matrix);
		if (index == 0) {
			holdPiece = lastPiece;
		} else {
			holdPiece = createPiece(cycle[--index]);
		}
		

	}
	player.pos.y = 0;
	player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
	drawHold();
	drawNext(cycle, index);
	index++;
	holded = true;
}

function rotate(matrix, dir) {
	for (let y = 0; y < matrix.length; ++y) {
		for (let x = 0; x < y; ++x) {
			[
				matrix[x][y], matrix[y][x],
			] = [
				matrix[y][x], matrix[x][y],
			];
		}
	}

	if (dir > 0) {
		matrix.forEach(row => row.reverse());
	} else {
		matrix.reverse();
	}
}

let dropCounter = 0
let dropInterval = 1000;

let lastTime = 0;

function update(time = 0) {
	const deltaTime = time - lastTime;
	lastTime = time;
	
	dropCounter += deltaTime;
	if (dropCounter > dropInterval) {
		playerDrop();
	}
	draw();
	requestAnimationFrame(update);
}

function updateScore() {
	document.getElementById('score').innerText = player.score;
}

const colors = [
 	null,
 	'#CCFF00',
 	'#FF3131',
 	'#03CDFF',
 	'#163CC1',
 	'#FDE802',
 	'#12E195',
 	'#E923F4'
];

const arena = createMatrix(10, 20);

const player = {
	pos: {x:0, y:0},
	matrix: null,
	score: 0,
}

const ghost = {
	pos: {x:0, y:0},
	matrix: null,
}

const nextMat = createMatrix(5, 20);
const holdMat = createMatrix(5, 5);
drawArena(holdMat, ctxHold);
holded = false;

document.addEventListener('keydown', event => {
	if (event.keyCode === 37){
		playerMove(-1)
	} else if (event.keyCode === 39) {
		playerMove(1);
	} else if (event.keyCode === 40) {
		playerDrop();
	} else if (event.keyCode === 32) {
		playerHardDrop();
	} else if (event.keyCode == 90 || event.keyCode == 17) {
		playerRotate(-1);
	} else if (event.keyCode == 38) {
		playerRotate(1);
	} else if (event.keyCode == 16 && holded == false) {
		playerHold();
	}
});

playerReset();
updateScore();
update();
// Happy Playing!!