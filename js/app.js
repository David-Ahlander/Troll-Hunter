
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
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

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

    reset();
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
    'img/cave_spider.png'
]);
resources.onReady(init);

// Game state
var player = {
    pos: [0, 0],
    sprite: new Sprite('img/wizard2.png', [110, 0], [55, 55])
};

var cave = {
    pos: [0, 0],
    sprite: new Sprite('img/cave.png', [0, 0], [210, 141])
};

var troll = {
    pos: [0, 0],
    sprite: new Sprite('img/troll.png', [0, 0], [200, 160]),
    hp: 5,
    maxHp: 5,
    delay: 500,
    resetHp: function(){
        this.hp = this.maxHp;
    },
    delay: function(){
        this.delay;
    },
    speed: 100
};

var spiders = [];

var bullets = [];
var enemies = [];
var explosions = [];

var trees = [];

var lastFire = Date.now();
var gameTime = 0;
var isGameOver;
var terrainPattern;

var numOfSpiders = 5;

var score = 0;
var scoreEl = document.getElementById('score');
var trollScore = 0;
var trollsKilled = document.getElementById('trollScore');

// Speed in pixels per second
var playerSpeed = 200;
var bulletSpeed = 800;

// Add some trees
trees.push(new Tree([0, 0]))
trees.push(new Tree([0, 0]))
trees.push(new Tree([0, 0]))

// Update game objects
function update(dt) {
    gameTime += dt;
    handleInput(dt);
    if (troll) {trollMovement(dt)};

    spiderMovement(dt);

    updateEntities(dt);

    // It gets harder over time by adding enemies using this
    // equation: 1-.993^gameTime
    // if(Math.random() < 1 - Math.pow(.999, gameTime)) {
    //     enemies.push({
    //         pos: [canvas.width,
    //               Math.random() * (canvas.height - 39)],
    //         sprite: new Sprite('img/troll.png', [0, 0], [200, 160],
    //                            0, [0, 1, 2, 3, 2, 1])
    //     });
    // }

    checkCollisions();

    scoreEl.innerHTML = score;
    trollsKilled.innerHTML = trollScore;
};

function moveEnemyUp(troll, dt) {
    console.log("up");
    troll.pos[1] -= troll.speed * dt;

}
function moveEnemyDown(troll, dt) {

    troll.pos[1] += troll.speed * dt;

}
function moveEnemyLeft(troll, dt) {

    troll.pos[0] -= troll.speed * dt;

}
function moveEnemyRight(troll, dt) {

    troll.pos[0] += troll.speed * dt;
}

function trollMovement(dt) {
    if (!troll) return;

    var moveFunctions = [moveEnemyUp, moveEnemyDown, moveEnemyLeft, moveEnemyRight];

    var index = Math.floor(Math.random() * moveFunctions.length);

    if (typeof troll.lastMovementIndex == "undefined" || troll.movementCount <= 0) {
        troll.movementCount = 50;
        troll.lastMovementIndex = index;
    } else {
        troll.movementCount--;
    }

    moveFunctions[troll.lastMovementIndex](troll, dt);
}

function spiderMovement(dt){
    if(spiders.length < numOfSpiders)
    {
        addSpider();
    }

    var moveFunctions = [moveEnemyUp, moveEnemyDown, moveEnemyLeft, moveEnemyRight];
    var index = Math.floor(Math.random() * moveFunctions.length);

    for(var i=0;i<spiders.length;i++)
    {
        var spider = spiders[i];

         if (typeof spider.lastMovementIndex == "undefined" || spider.movementCount <= 0) {
            spider.movementCount = 20;
            spider.lastMovementIndex = index;
        } else {
            spider.movementCount--;
        }

        moveFunctions[spider.lastMovementIndex](spider, dt);
    }
}

function addSpider(){
    spiders.push({
        pos: [cave.pos[0], cave.pos[1] ],
        sprite: new Sprite('img/cave_spider.png', [0, 0], [31, 31]),
        hp: 1,
        maxHp: 1,
        delay: 500,
        resetHp: function(){
            this.hp = this.maxHp;
        },
        delay: function(){
            this.delay;
        },
        speed: 300
    });
}

function handleInput(dt) {
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += playerSpeed * dt;
        player.sprite.pointDown();
    }

    else if(input.isDown('UP') || input.isDown('w')) {
        player.pos[1] -= playerSpeed * dt;
        player.sprite.pointUp();
    }

    else if(input.isDown('LEFT') || input.isDown('a')) {
        player.pos[0] -= playerSpeed * dt;
        player.sprite.pointLeft();
    }

    else if(input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt;
        player.sprite.pointRight();
    }

    if(input.isDown('SPACE') &&
       !isGameOver &&
       Date.now() - lastFire > 100) {
        var x = player.pos[0] + player.sprite.size[0] / 2;
        var y = player.pos[1] + player.sprite.size[1] / 2;

        bullets.push({pos: [x, y], dir:player.sprite.pointedAt(), sprite: new Sprite('img/IonShot.png', [0, 0], [21, 21]) });

        if (trollScore > 1) {
            bulletSpeed = 1500;
            troll.speed = 200;
        };

        if (score > 10000) {
            bulletSpeed = 1500;
            enemySpeed = 150;
        };

        lastFire = Date.now();
    }
}

function updateEntities(dt) {
    // Update the player sprite animation
    player.sprite.update(dt);
    troll && troll.sprite.update(dt);
    for (var n = 0; n < trees.length; n++) {
        trees[n].sprite.update(dt);
    }
    cave.sprite.update(dt);

    // Update all the bullets
    for(var i=0; i<bullets.length; i++) {
        var bullet = bullets[i];

        switch(bullet.dir) {
        case 'up': bullet.pos[1] -= bulletSpeed * dt; break;
        case 'down': bullet.pos[1] += bulletSpeed * dt; break;
        case 'right': bullet.pos[0] += bulletSpeed * dt; break;
        case 'left': bullet.pos[0] -= bulletSpeed * dt; break;
        default:
            bullet.pos[0] += bulletSpeed * dt;
        }

        // Remove the bullet if it goes offscreen
        if(bullet.pos[1] < 0 || bullet.pos[1] > canvas.height ||
           bullet.pos[0] < 0 || bullet.pos[0] > canvas.width) {
            bullets.splice(i, 1);
            i--;
        }
    }

    // Update all the explosions
    for(var i=0; i<explosions.length; i++) {
        explosions[i].sprite.update(dt);

        // Remove if animation is done
        if(explosions[i].sprite.done) {
            explosions.splice(i, 1);
            i--;
        }
    }
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

function bulletsHitsEnemy(enemy, onHit) {
    if (!enemy) { return false};

    var enemyPos = enemy.pos;
    var enemySpriteSize = enemy.sprite.size;

    for(var j=0; j<bullets.length; j++) {
        console.log("New loop");
        var pos = bullets[j].pos;
        var size = bullets[j].sprite.size;

        console.log(bullets[j]);

        if(boxCollides(enemyPos, enemySpriteSize, pos, size)) {
            enemy.hp--;
            onHit();
            // Add score
            score += 1;

            // Add an explosion
            explosions.push({
                pos: enemyPos,
                sprite: new Sprite('img/blood.png',
                                   [0, 0],
                                   [200, 160],
                                   25,
                                   [0, 1, 2, 3, 2, 1, 0],
                                   null,
                                   true)
            });

            // Remove the bullet and stop this iteration
            bullets.splice(j, 1);
            console.log("Kill enemy");
            return true;
        }
        return false;
    }

}

function checkCollisions() {
    checkPlayerBounds();
    for (var n = 0; n < trees.length; n++) {
        checkHitTree(trees[n]);
    }
    checkHitTroll();
    checkHitSpiders();
    bulletsHitTree();
    bulletsHitSpiders();
    bulletsHitTroll();
}

function checkPlayerBounds() {
    // Check bounds
    if(player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
    }

    if(troll && troll.pos[0] < 0) {
        troll.pos[0] = 0;
    }
    else if(troll && troll.pos[0] > canvas.width - troll.sprite.size[0]) {
        troll.pos[0] = canvas.width - troll.sprite.size[0];
    }

    if(troll && troll.pos[1] < 0) {
        troll.pos[1] = 0;
    }
    else if(troll && troll.pos[1] > canvas.height - troll.sprite.size[1]) {
        troll.pos[1] = canvas.height - troll.sprite.size[1];
    }

    for(var i=0;i<spiders.length;i++)
    {
        var spider = spiders[i];
        if(spider && spider.pos[0] < 0) {
            spider.pos[0] = 0;
        }
        else if(spider && spider.pos[0] > canvas.width - spider.sprite.size[0]) {
            spider.pos[0] = canvas.width - spider.sprite.size[0];
        }

        if(spider && spider.pos[1] < 0) {
            spider.pos[1] = 0;
        }
        else if(spider && spider.pos[1] > canvas.height - spider.sprite.size[1]) {
            spider.pos[1] = canvas.height - spider.sprite.size[1];
        }
    }
}

// Draw everything
function render() {
    ctx.fillStyle = terrainPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render the player if the game isn't over
    if(!isGameOver) {
        renderEntity(cave);
        renderEntity(player);
        for (var n = 0; n < trees.length; n++) {
            renderEntity(trees[n]);
        }
        if (troll) {renderEntity(troll)};
    }

    renderEntities(bullets);
    renderEntities(enemies);
    renderEntities(explosions);

    renderEntities(spiders);
};

function renderEntities(list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}

// Game over
function gameOver() {

    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
    document.getElementById('play-again').focus();

}

// Reset game to original state
function reset() {

    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    isGameOver = false;
    gameTime = 0;
    score = 0;
    trollScore = 0;

    enemies = [];
    bullets = [];

    player.pos = [50, canvas.height / 2];
    cave.pos = [590, canvas.height - 600];
    troll.pos = [500, canvas.height - 600];

    for (var n = 0; n < trees.length; n++) {
        trees[n].randomizePosition();
    }
};

function checkHitTree(tree) {
    // Unable player to walk through trees

    if(boxCollides(player.pos, player.sprite.size, tree.pos, tree.sprite.size)) {

        if (player.sprite.pointedAt() == 'up') {
            player.pos[1] = tree.pos[1] + 109;
        }
        if (player.sprite.pointedAt() == 'down') {
            player.pos[1] = tree.pos[1] - 55;
        }
        if (player.sprite.pointedAt() == 'right') {
            player.pos[0] = tree.pos[0] - 55;
        }
        if (player.sprite.pointedAt() == 'left') {
            player.pos[0] = tree.pos[0] + 121;
        }
    }
}

function checkHitTroll() {
    // Unable player to walk through trees
    if(troll && boxCollides(player.pos, player.sprite.size, troll.pos, troll.sprite.size)) {
        gameOver();
    }
}

function checkHitSpiders(){
    //Check if spiders catch Züper Alex
    for(var i=0;i<spiders.length;i++){
        var spider = spiders[i];
        if(spider && boxCollides(player.pos, player.sprite.size, spider.pos, spider.sprite.size)) {
            gameOver();
        }
    }
}

function bulletsHitTroll() {
    // Unable player to walk through trees

    bulletsHitsEnemy(troll, function(){

        if (troll && troll.hp <= 0) {

            troll.delay();

            troll.pos = [500, canvas.height - 600];
            troll.maxHp = troll.maxHp * 2;
            troll.resetHp();
            trollScore += 1;
        };
    });
}

function bulletsHitTree(){
    // Check if bullets hit trees
    var treepos = [];

    treepos.push(tree.pos);
    treepos.push(tree2.pos);

    var treespritesize = tree.sprite.size;

    for(var j=0; j<bullets.length; j++) {
        var pos = bullets[j].pos;
        var size = bullets[j].sprite.size;

        for(var i=0;i<treepos.length;i++)
        {
            if(boxCollides(treepos[i], treespritesize, pos, size)) {
               // Add an explosion
                explosions.push({
                    pos: pos,
                    sprite: new Sprite('img/sprites.png',
                                       [0, 116],
                                       [39, 40],
                                       20,
                                       [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                                       null,
                                       true)
                });
                // Remove the bullet and stop this iteration
                bullets.splice(j, 1);
                return true;
            }
        }
        return false;
    }
}

function bulletsHitSpiders(){
    // Check if bullets hit trees

    var spidersize = spiders[0].sprite.size;


    for(var j=0; j<bullets.length; j++) {
        console.log("New loop");
        var pos = bullets[j].pos;
        var size = bullets[j].sprite.size;

        for(var i=0;i<spiders.length;i++)
        {
            if(boxCollides(spiders[i].pos, spidersize, pos, size)) {
               // Add an explosion
                explosions.push({
                    pos: pos,
                    sprite: new Sprite('img/sprites.png',
                                       [0, 116],
                                       [39, 40],
                                       20,
                                       [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                                       null,
                                       true)
                });
                // Remove the bullet and stop this iteration
                bullets.splice(j, 1);

                spiders.splice(i,1);

                return true;

            }
        }
        return false;
    }
}


if (typeof troll.lastMovementIndex == "undefined" || troll.movementCount <= 0) {
    troll.movementCount = 50;
    troll.lastMovementIndex = index;
} else {
    troll.movementCount--;
}

moveFunctions[troll.lastMovementIndex](troll, dt);
