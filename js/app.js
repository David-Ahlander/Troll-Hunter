// Create a global logger
window.logger = new Logger;

   logger.enable(); // Enable it like this via console
// logger.disable(); // Disable it like this via console

// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
 return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
        window.setTimeout(callback, 1000 / 60);
        };
})();

// Create the canvas
var gameElement = document.getElementById('game-box');
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
gameElement.appendChild(canvas);

// The main game loop
var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};

function init() {
    terrainPattern = ctx.createPattern(resources.get('img/background.png'), 'repeat');

    document.getElementById('play-again').addEventListener('click', function() {

        location.reload(true);

        // reset();
    });

    game = new Game({
    });

    lastTime = Date.now();
    main();
}

resources.load([
    'img/sprites.png',
    'img/tree.png',
    'img/cave.png',
    'img/troll.png',
    'img/blood.png',
    'img/wizard.png',
    'img/wizard2.png',
    'img/background.png',
    'img/IonShot.png',
    'img/cave_spider.png',
    'img/bomb.png'
]);
resources.onReady(init);

var lastFire = Date.now();
var gameTime = 0;
var isGameOver;
var terrainPattern;

var numOfSpiders = 5;

var highscore = new Highscore;

var game;

function randomFromArray(array) {
    var index = Math.floor(Math.random() * array.length);
    return array[index];
}

// Collisions

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}

