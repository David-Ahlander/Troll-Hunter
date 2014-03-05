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
player = new Player([0, 0]);

var cave = {
    pos: [0, 0],
    sprite: new Sprite('img/cave.png', [0, 0], [210, 141])
};

var trollSpawn = [500, canvas.height - 600];

var trolls = [];

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

var highscore = new Highscore;

// Class that counts scores
var scores;

// Class that counts scores
var level = new Levels();

// Add some trees
trees.push(new Tree([0, 0]))
trees.push(new Tree([0, 0]))
trees.push(new Tree([0, 0]))

// Update game objects
function update(dt) {
    gameTime += dt;
    handleInput(dt);
    for (var n = 0; n < trolls.length; n++) {
        trollMovement(trolls[n], dt);
    }

    spiderMovement(dt);

    updateEntities(dt);

    var template = document.getElementById('scoreTemplate').innerHTML;

    document.getElementById('scorePanel')
        .innerHTML = Mustache.render(template, scores.calculate());

    var template = document.getElementById('highscoreTemplate').innerHTML;
    document.getElementById('highscore')
        .innerHTML = Mustache.render(template, highscore.mustacheData(scores));

    checkCollisions();

};

function moveEnemyUp(enemy, dt) {

    enemy.pos[1] -= enemy.speed * dt;

}
function moveEnemyDown(enemy, dt) {

    enemy.pos[1] += enemy.speed * dt;

}
function moveEnemyLeft(enemy, dt) {

    enemy.pos[0] -= enemy.speed * dt;

}
function moveEnemyRight(enemy, dt) {

    enemy.pos[0] += enemy.speed * dt;
    
}

function trollMovement(troll, dt) {
    if (!troll) return;

    var moveFunctions = [moveEnemyUp, moveEnemyDown, moveEnemyLeft, moveEnemyRight];

    var index = Math.floor(Math.random() * moveFunctions.length);

    if (typeof troll.lastMovementIndex == "undefined" || troll.movementCount <= 0) {
        troll.movementCount = 100;
        troll.lastMovementIndex = index;
    } else {
        troll.movementCount--;
    }

    moveFunctions[troll.lastMovementIndex](troll, dt);
}

function randomFromArray(array) {
    var index = Math.floor(Math.random() * array.length);
    return array[index];
}

function spiderMovement(dt){
    if(spiders.length < numOfSpiders)
    {
        var spawnTree = randomFromArray(trees);
        var posX = spawnTree.pos[0] + (spawnTree.sprite.size[0] / 2);
        var posY = spawnTree.pos[1] + (spawnTree.sprite.size[1] / 4);
        spiders.push(new Spider([posX, posY]));
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

function handleInput(dt) {
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.moveDown(dt);
    }

    else if(input.isDown('UP') || input.isDown('w')) {
        player.moveUp(dt);
    }

    else if(input.isDown('LEFT') || input.isDown('a')) {
        player.moveLeft(dt);
    }

    else if(input.isDown('RIGHT') || input.isDown('d')) {
        player.moveRight(dt);
    }

    if(input.isDown('SPACE') &&
       !isGameOver &&
       Date.now() - lastFire > 100) {
        var x = player.pos[0] + player.sprite.size[0] / 2;
        var y = player.pos[1] + player.sprite.size[1] / 2;

        bullets.push({pos: [x, y], dir:player.pointedAt(), sprite: new Sprite('img/IonShot.png', [0, 0], [21, 21]) });
        
        // TODO (FUTURE EVENT)
        // If score divided by a hundred is greater than number of trolls ^2
        // Adds a new troll when scores passes 200, 500, 1000, 1700, ...
        // if (Math.floor(totalScore / 100) > Math.pow(trolls.length, 2)) {
        //     trolls.push(new Troll({
        //         pos: [trollSpawn[0], trollSpawn[1]]
        //     }));
        // }

        lastFire = Date.now();
        scores.bulletFired += 1;
    }
}

function updateEntities(dt) {
    // Update the player sprite animation
    player.sprite.update(dt);
    for (var n = 0; n < trolls.length; n++) {
        trolls[n].sprite.update(dt);
    }
    for (var n = 0; n < trees.length; n++) {
        trees[n].sprite.update(dt);
    }
    cave.sprite.update(dt);

    level.increaseLevel();

    // Update all the bullets
    for(var i=0; i<bullets.length; i++) {
        var bullet = bullets[i];

        switch(bullet.dir) {
        case 'up': bullet.pos[1] -= player.attackSpeed * dt; break;
        case 'down': bullet.pos[1] += player.attackSpeed * dt; break;
        case 'right': bullet.pos[0] += player.attackSpeed * dt; break;
        case 'left': bullet.pos[0] -= player.attackSpeed * dt; break;
        default:
            bullet.pos[0] += player.attackSpeed * dt;
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
        var pos = bullets[j].pos;
        var size = bullets[j].sprite.size;

        if(boxCollides(enemyPos, enemySpriteSize, pos, size)) {
            enemy.hp--;
            onHit();
            // Add scores.bulletHits
            scores.bulletHits += 1;

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
        }
    }

}

function checkCollisions() {
    checkPlayerBounds();
    for (var n = 0; n < trees.length; n++) {
        checkHitTree(trees[n]);
    }
    for (var n = 0; n < trees.length; n++) {
        checkHitTroll(trolls[n]);
    }
    checkHitSpiders();
    bulletsHitTree();
    bulletsHitSpiders();
    // Backwards because we might splice a troll which makes indexes change
    for (var n = trolls.length - 1; n >= 0; n--) {
        bulletsHitTroll(trolls[n], n);
    }
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

    for (var n = 0; n < trolls.length; n++) {
        checkTrollBounds(trolls[n]);
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

function checkTrollBounds(troll) {
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
        for (var n = 0; n < trolls.length; n++) {
            renderEntity(trolls[n]);
        }
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
    // Reset position pointers for new objects. Position 0, 0 will become top
    // left corner for new items such as sprites and health bars.
    ctx.translate(entity.pos[0], entity.pos[1]);

    entity.sprite.render(ctx);

    // Render health bar if `entity` got one.
    if (entity.healthBar) {
        entity.healthBar.render(ctx);
    }
    ctx.restore();
}

// Game over
function gameOver() {
    // Only run this method once
    if (isGameOver) return;

    isGameOver = true;

    highscore.add(scores);
    highscore.save();
    // var mustacheData = {
    //     list: highscore.list.slice(0, 5)
    // };
    // var template = document.getElementById('highscoreTemplate').innerHTML;
    // document.getElementById('highscore')
    //     .innerHTML = Mustache.render(template, mustacheData);

    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    document.getElementById('play-again').focus();

}

// Reset game to original state
function reset() {

    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    isGameOver = false;
    gameTime = 0;
    scores = new Scores;

    enemies = [];
    bullets = [];

    player.pos = [50, canvas.height / 2];
    cave.pos = [590, canvas.height - 600];
    trolls = [];
    trolls.push(new Troll({
        pos: [trollSpawn[0], trollSpawn[1]]
    }));

    for (var n = 0; n < trees.length; n++) {
        trees[n].randomizePosition();
    }
};

function checkHitTree(tree) {
    // Unable player to walk through trees

    if(boxCollides(player.pos, player.sprite.size, tree.pos, tree.sprite.size)) {

        if (player.pointedAt() == 'up') {
            player.pos[1] = tree.pos[1] + 109;
        }
        if (player.pointedAt() == 'down') {
            player.pos[1] = tree.pos[1] - 55;
        }
        if (player.pointedAt() == 'right') {
            player.pos[0] = tree.pos[0] - 55;
        }
        if (player.pointedAt() == 'left') {
            player.pos[0] = tree.pos[0] + 121;
        }
    }
}

function checkHitTroll(troll) {
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

function bulletsHitTroll(troll, index) {
    // Unable player to walk through trees

    bulletsHitsEnemy(troll, function(){

        if (troll && troll.hp <= 0) {
            trolls.splice(index, 1);

            logger.debug('Killed troll at ' + troll.pos);

            setTimeout(function () {
            trolls.push(new Troll({
                pos: [trollSpawn[0], trollSpawn[1]],
                maxHp: troll.maxHp * 2
            }));
            }, 2000);

            scores.trollsKilled += 1;

            //Increase level here
        };
    });
}

function bulletsHitTree(){
    // Check if bullets hit trees

    var treespritesize = trees[0].sprite.size;

    for(var j=0; j<bullets.length; j++) {
        var pos = bullets[j].pos;
        var size = bullets[j].sprite.size;

        for(var i=0;i<trees.length;i++)
        {
            if(boxCollides(trees[i].pos, treespritesize, pos, size)) {
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
            }
        }
    }
}

function bulletsHitSpiders(){
    // Check if bullets hit trees

    var spidersize = spiders[0].sprite.size;


    for(var j=0; j<bullets.length; j++) {
        var pos = bullets[j].pos;
        var size = bullets[j].sprite.size;

        for(var i=0;i<spiders.length;i++)
        {
            if(boxCollides(spiders[i].pos, spidersize, pos, size)) {
               // Add an explosion
                explosions.push({
                    pos: spiders[i].pos,
                    sprite: new Sprite('img/blood.png',
                                       [75, 45],
                                       [180, 50],
                                       1,
                                       [0],
                                       null,
                                       true)
                });
                // Remove the bullet and stop this iteration
                bullets.splice(j, 1);

                spiders.splice(i,1);
                logger.debug('Killed spider at ' + pos);

                scores.spidersKilled += 1;
                scores.bulletHits += 1;

                

            }
        }

    }
}
