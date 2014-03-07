(function () {
    function Game(options) {
        options = options || {};
        this.player = new Player({});
        this.canvas = options.canvas;
        this.gameTime = 0;
        this.isGameOver = false;
        this.reset();
    }

    // Update game objects
    Game.prototype.update = function (dt) {
        this.gameTime += dt;
        this.handleInput(dt);
        for (var n = 0; n < this.level.trolls.length; n++) {
            this.trollMovement(this.level.trolls[n], dt);
        }

        this.spiderMovement(dt);

        this.updateEntities(dt);

        var template = document.getElementById('scoreTemplate').innerHTML;

        document.getElementById('scorePanel')
            .innerHTML = Mustache.render(template, this.level.scores.calculate());

        var template = document.getElementById('highscoreTemplate').innerHTML;
        document.getElementById('highscore')
            .innerHTML = Mustache.render(template, highscore.mustacheData(this.level.scores));

        this.checkCollisions();

    };

    Game.prototype.moveEnemyUp = function (enemy, dt) {

        enemy.pos[1] -= enemy.speed * dt;

    };
    Game.prototype.moveEnemyDown = function (enemy, dt) {

        enemy.pos[1] += enemy.speed * dt;

    };
    Game.prototype.moveEnemyLeft = function (enemy, dt) {

        enemy.pos[0] -= enemy.speed * dt;

    };
    Game.prototype.moveEnemyRight = function (enemy, dt) {

        enemy.pos[0] += enemy.speed * dt;

    };

    Game.prototype.trollMovement = function (troll, dt) {
        if (!troll) return;

        var moveFunctions = [this.moveEnemyUp, this.moveEnemyDown, this.moveEnemyLeft, this.moveEnemyRight];

        var index = Math.floor(Math.random() * moveFunctions.length);

        if (typeof troll.lastMovementIndex == "undefined" || troll.movementCount <= 0) {
            troll.movementCount = 100;
            troll.lastMovementIndex = index;
        } else {
            troll.movementCount--;
        }

        moveFunctions[troll.lastMovementIndex](troll, dt);
    };

    Game.prototype.spiderMovement = function (dt) {
        if(this.level.spiders.length < numOfSpiders)
        {
            this.level.spawnSpider();
        }

        var moveFunctions = [this.moveEnemyUp, this.moveEnemyDown, this.moveEnemyLeft, this.moveEnemyRight];
        var index = Math.floor(Math.random() * moveFunctions.length);

        for(var i=0;i<this.level.spiders.length;i++)
        {
            var spider = this.level.spiders[i];

            if (typeof spider.lastMovementIndex == "undefined" || spider.movementCount <= 0) {
                spider.movementCount = 20;
                spider.lastMovementIndex = index;
            } else {
                spider.movementCount--;
            }

            moveFunctions[spider.lastMovementIndex](spider, dt);
        }
    };

    Game.prototype.handleInput = function (dt) {
        if(input.isDown('DOWN') || input.isDown('s')) {
            this.level.player.moveDown(dt);
        }

        else if(input.isDown('UP') || input.isDown('w')) {
            this.level.player.moveUp(dt);
        }

        else if(input.isDown('LEFT') || input.isDown('a')) {
            this.level.player.moveLeft(dt);
        }

        else if(input.isDown('RIGHT') || input.isDown('d')) {
            this.level.player.moveRight(dt);
        }

        if(input.isDown('SPACE') &&
        !this.isGameOver &&
        Date.now() - lastFire > 100) {
            var x = this.level.player.pos[0] + this.level.player.sprite.size[0] / 2;
            var y = this.level.player.pos[1] + this.level.player.sprite.size[1] / 2;

            if(this.level.player.bomb)
            {
                this.level.player.shotsFired.push(new Bomb({
                    pos: [x, y],
                    dir: this.level.player.pointedAt()
                }));
                this.level.player.bomb=null;
            }
            else
            {
                this.level.player.shotsFired.push(new Bullet({
                    pos: [x, y],
                    dir: this.level.player.pointedAt()
                }));
            }

            // TODO (FUTURE EVENT)
            // If score divided by a hundred is greater than number of trolls ^2
            // Adds a new troll when scores passes 200, 500, 1000, 1700, ...
            // if (Math.floor(totalScore / 100) > Math.pow(this.level.trolls.length, 2)) {
            //     this.level.spawnTroll({
            //     });
            // }

            lastFire = Date.now();
            this.level.scores.bulletFired += 1;
        }

        if (this.isGameOver && input.isDown('RETURN')) {
            location.reload(true);
        };
    };

    Game.prototype.updateEntities = function (dt) {
        // Update the player sprite animation
        this.level.player.sprite.update(dt);
        for (var n = 0; n < this.level.trolls.length; n++) {
            this.level.trolls[n].sprite.update(dt);
        }
        for (var n = 0; n < this.level.trees.length; n++) {
            this.level.trees[n].sprite.update(dt);
        }
        for (var n = 0; n < this.level.caves.length; n++) {
            this.level.caves[n].sprite.update(dt);
        }

        // this.level.increaseLevel();

        // Update all the bullets
        for(var i=0; i<this.level.player.shotsFired.length; i++) {
            var bullet = this.level.player.shotsFired[i];

            switch(bullet.dir) {
            case 'up': bullet.pos[1] -= this.level.player.attackSpeed * dt; break;
            case 'down': bullet.pos[1] += this.level.player.attackSpeed * dt; break;
            case 'right': bullet.pos[0] += this.level.player.attackSpeed * dt; break;
            case 'left': bullet.pos[0] -= this.level.player.attackSpeed * dt; break;
            default:
                bullet.pos[0] += this.level.player.attackSpeed * dt;
            }

            // Remove the bullet if it goes offscreen
            if(bullet.pos[1] < 0 || bullet.pos[1] > this.canvas.height ||
            bullet.pos[0] < 0 || bullet.pos[0] > this.canvas.width) {
                this.level.player.shotsFired.splice(i, 1);
                i--;
            }
        }

        // Update all the explosions
        for(var i=0; i<this.level.explosions.length; i++) {
            this.level.explosions[i].sprite.update(dt);

            // Remove if animation is done
            if(this.level.explosions[i].sprite.done) {
                this.level.explosions.splice(i, 1);
                i--;
            }
        }
    };

    Game.prototype.bulletsHitsEnemy = function (enemy, onHit) {
        if (!enemy) { return false};

        var enemyPos = enemy.pos;
        var enemySpriteSize = enemy.sprite.size;

        for(var j=0; j<this.level.player.shotsFired.length; j++) {
            var pos = this.level.player.shotsFired[j].pos;
            var size = this.level.player.shotsFired[j].sprite.size;


            if(boxCollides(enemyPos, enemySpriteSize, pos, size)) {
                
                if(damage = this.level.player.shotsFired[j].damage){
                    enemy.hp = enemy.hp - damage;
                }   
                else {
                    enemy.hp--;
                }
                onHit();
                // Add this.level.scores.bulletHits
                this.level.scores.bulletHits += 1;

                // Add an explosion
                this.level.explosions.push({
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
                this.level.player.shotsFired.splice(j, 1);

            }
        }
    };

    Game.prototype.checkCollisions = function () {
        this.checkPlayerBounds();
        for (var n = 0; n < this.level.trees.length; n++) {
            this.checkHitTree(this.level.trees[n]);
        }
        for (var n = 0; n < this.level.trees.length; n++) {
            this.checkHitTroll(this.level.trolls[n]);
        }
        this.checkHitSpiders();
        this.checkPickUpBomb();

        this.bulletsHitTree();
        this.bulletsHitSpiders();
        // Backwards because we might splice a troll which makes indexes change
        for (var n = this.level.trolls.length - 1; n >= 0; n--) {
            this.bulletsHitTroll(this.level.trolls[n], n);
        }
    };

    Game.prototype.checkPlayerBounds = function () {
        // Check bounds
        if(this.level.player.pos[0] < 0) {
            this.level.player.pos[0] = 0;
        }
        else if(this.level.player.pos[0] > this.canvas.width - this.level.player.sprite.size[0]) {
            this.level.player.pos[0] = this.canvas.width - this.level.player.sprite.size[0];
        }

        if(this.level.player.pos[1] < 0) {
            this.level.player.pos[1] = 0;
        }
        else if(this.level.player.pos[1] > this.canvas.height - this.level.player.sprite.size[1]) {
            this.level.player.pos[1] = this.canvas.height - this.level.player.sprite.size[1];
        }

        for (var n = 0; n < this.level.trolls.length; n++) {
            this.checkTrollBounds(this.level.trolls[n]);
        }

        for(var i=0;i<this.level.spiders.length;i++)
        {
            var spider = this.level.spiders[i];
            if(spider && spider.pos[0] < 0) {
                spider.pos[0] = 0;
            }
            else if(spider && spider.pos[0] > this.canvas.width - spider.sprite.size[0]) {
                spider.pos[0] = this.canvas.width - spider.sprite.size[0];
            }

            if(spider && spider.pos[1] < 0) {
                spider.pos[1] = 0;
            }
            else if(spider && spider.pos[1] > this.canvas.height - spider.sprite.size[1]) {
                spider.pos[1] = this.canvas.height - spider.sprite.size[1];
            }
        }
    };

    Game.prototype.checkTrollBounds = function (troll) {
        if(troll && troll.pos[0] < 0) {
            troll.pos[0] = 0;
        }
        else if(troll && troll.pos[0] > this.canvas.width - troll.sprite.size[0]) {
            troll.pos[0] = this.canvas.width - troll.sprite.size[0];
        }

        if(troll && troll.pos[1] < 0) {
            troll.pos[1] = 0;
        }
        else if(troll && troll.pos[1] > this.canvas.height - troll.sprite.size[1]) {
            troll.pos[1] = this.canvas.height - troll.sprite.size[1];
        }
    };

    // Draw everything
    Game.prototype.render = function () {
        ctx.fillStyle = terrainPattern;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Render the player if the game isn't over
        if(!this.isGameOver) {
            for (var n = 0; n < this.level.caves.length; n++) {
                this.renderEntity(this.level.caves[n]);
            }
            this.renderEntity(this.level.player);
            for (var n = 0; n < this.level.trees.length; n++) {
                this.renderEntity(this.level.trees[n]);
            }
            for (var n = 0; n < this.level.trolls.length; n++) {
                this.renderEntity(this.level.trolls[n]);
            }
        }

        this.renderEntities(this.level.player.shotsFired);
        this.renderEntities(this.level.explosions);
        this.renderEntities(this.level.bombs);
        this.renderEntities(this.level.spiders);

    };

    Game.prototype.renderEntities = function (list) {
        for(var i=0; i<list.length; i++) {
            this.renderEntity(list[i]);
        }
    };

    Game.prototype.renderEntity = function (entity) {
        ctx.save();
        // Reset position pointers for new objects. Position 0, 0 will become top
        // left corner for new items such as sprites and health bars.
        ctx.translate(entity.pos[0], entity.pos[1]);

        entity.sprite.render(ctx);

        // Render health bar if `entity` got one.
        if (entity.healthBar) {
            entity.healthBar.render(ctx);
        }

        //logger.debug(entity.bomb);
        if(entity.bomb){
            entity.bomb.sprite.render(ctx);
        }

        ctx.restore();
    };

    // Game over
    Game.prototype.gameOver = function () {
        // Only run this method once
        if (this.isGameOver) return;

        this.isGameOver = true;

        highscore.add(this.level.scores);
        highscore.save();
        // var mustacheData = {
        //     list: highscore.list.slice(0, 5)
        // };
        // var template = document.getElementById('highscoreTemplate').innerHTML;
        // document.getElementById('highscore')
        //     .innerHTML = Mustache.render(template, mustacheData);

        document.getElementById('game-over').style.display = 'block';
        document.getElementById('game-over-overlay').style.display = 'block';

    };

    // Reset game to original state
    Game.prototype.reset = function () {

        document.getElementById('game-over').style.display = 'none';
        document.getElementById('game-over-overlay').style.display = 'none';
        this.isGameOver = false;
        this.gameTime = 0;

        this.level = new Level({
            nr: 1,
            player: this.player,
            scores: new Scores,
            canvas: this.canvas
        });
    };

    Game.prototype.checkHitTree = function (tree) {
        // Unable player to walk through trees

        if(boxCollides(this.level.player.pos, this.level.player.sprite.size, tree.pos, tree.sprite.size)) {

            if (this.level.player.pointedAt() == 'up') {
                this.level.player.pos[1] = tree.pos[1] + 109;
            }
            if (this.level.player.pointedAt() == 'down') {
                this.level.player.pos[1] = tree.pos[1] - 55;
            }
            if (this.level.player.pointedAt() == 'right') {
                this.level.player.pos[0] = tree.pos[0] - 55;
            }
            if (this.level.player.pointedAt() == 'left') {
                this.level.player.pos[0] = tree.pos[0] + 121;
            }
        }
    };

    Game.prototype.checkHitTroll = function (troll) {
        // Unable player to walk through trees
        if(troll && boxCollides(this.level.player.pos, this.level.player.sprite.size, troll.pos, troll.sprite.size)) {
            this.gameOver();
        }
    };

    Game.prototype.checkHitSpiders = function () {
        //Check if spiders catch Züper Alex
        for(var i=0;i<this.level.spiders.length;i++){
            var spider = this.level.spiders[i];
            if(spider && boxCollides(this.level.player.pos, this.level.player.sprite.size, spider.pos, spider.sprite.size)) {
                this.gameOver();
            }
        }
    };

    Game.prototype.checkPickUpBomb = function () {
        for(var i = 0; i < this.level.bombs.length; i++){
            var bomb = this.level.bombs[i];
            if(bomb && boxCollides(this.level.player.pos, this.level.player.sprite.size, bomb.pos, bomb.sprite.size)) {
                this.level.player.bomb = bomb;
                bomb.pos = this.level.player.pos;
                this.level.bombs.splice(i,1);
            }
        }
    };

    Game.prototype.bulletsHitTroll = function (troll, index) {
        // Unable player to walk through trees

        var that = this;

        this.bulletsHitsEnemy(troll, function(){

            if (troll && troll.hp <= 0) {
                that.level.trolls.splice(index, 1);

                logger.debug('Killed troll at ' + troll.pos);

                setTimeout(function () {
                that.level.spawnTroll({
                    maxHp: troll.maxHp * 2
                });
                }, 2000);

                that.level.scores.trollsKilled += 1;

                //Increase level here
            };
        });
    };

    Game.prototype.bulletsHitTree = function () {
        // Check if bullets hit trees

        var treespritesize = this.level.trees[0].sprite.size;

        for(var j=0; j<this.level.player.shotsFired.length; j++) {
            var pos = this.level.player.shotsFired[j].pos;
            var size = this.level.player.shotsFired[j].sprite.size;

            for(var i=0;i<this.level.trees.length;i++)
            {
                if(boxCollides(this.level.trees[i].pos, treespritesize, pos, size)) {
                // Add an explosion
                    this.level.explosions.push({
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
                    this.level.player.shotsFired.splice(j, 1);
                }
            }
        }
    };

    Game.prototype.bulletsHitSpiders = function () {
        // Check if bullets hit trees

        var spidersize = this.level.spiders[0].sprite.size;

        for(var j=0; j<this.level.player.shotsFired.length; j++) {
            var pos = this.level.player.shotsFired[j].pos;
            var size = this.level.player.shotsFired[j].sprite.size;

            for(var i=0;i<this.level.spiders.length;i++)
            {
                if(boxCollides(this.level.spiders[i].pos, spidersize, pos, size)) {
                // Add an explosion
                    this.level.explosions.push({
                        pos: this.level.spiders[i].pos,
                        sprite: new Sprite('img/blood.png',
                                        [75, 45],
                                        [180, 50],
                                        1,
                                        [0],
                                        null,
                                        true)
                    });
                    // Remove the bullet and stop this iteration
                    this.level.player.shotsFired.splice(j, 1);

                    if(Math.floor((Math.random()*10)+1)==1)
                    {
                        this.level.bombs.push({
                            pos: this.level.spiders[i].pos,
                            sprite: new Sprite('img/bomb.png', [0, 0], [31, 31])
                        });
                    }

                    this.level.spiders.splice(i,1);
                    logger.debug('Killed spider at ' + pos);

                    this.level.scores.spidersKilled += 1;
                    this.level.scores.bulletHits += 1;
                }
            }
        }
    };

    window.Game = Game;
})();
