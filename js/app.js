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

    game.update(dt);
    game.render();

    lastTime = now;
    requestAnimFrame(main);
};

function init() {
    document.getElementById('play-again').addEventListener('click', function() {

        location.reload(true);

        // reset();
    });

    game = new Game({
        canvas: canvas
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
    'img/level-1/background.png',
    'img/IonShot.png',
    'img/cave_spider.png',
    'img/bomb.png',
    'img/dead-tree.png'
]);
resources.onReady(init);

var lastFire = Date.now();

var numOfSpiders = 5;

var highscore = new Highscore;

var game;

var levelPanel = new PanelView({
    element:  document.getElementById('levelPanel'),
    template: document.getElementById('levelTemplate').innerHTML
});

var scorePanel = new PanelView({
    element:  document.getElementById('scorePanel'),
    template: document.getElementById('scoreTemplate').innerHTML
});

var highscorePanel = new PanelView({
    element:  document.getElementById('highscore'),
    template: document.getElementById('highscoreTemplate').innerHTML
});

function randomFromArray(array) {
    var index = Math.floor(Math.random() * array.length);
    return array[index];
}

// Collisions
function collides(posXLeft, posYTop, posXRight, posYBottom, posXLeft2, posYTop2, posXRight2, posYBottom2) {
    return !(posXRight <= posXLeft2 || posXLeft > posXRight2 ||
             posYBottom <= posYTop2 || posYTop > posYBottom2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}

function entitiesCollides(entityOne, entityTwo){
    return boxCollides(entityOne.pos, entityOne.sprite.size,
                       entityTwo.pos, entityTwo.sprite.size);
}
