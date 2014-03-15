(function () {
    function Game(options) {
        options = options || {};
        this.player = new Player({});
        this.player.score = new Score;
        this.canvas = options.canvas;
        this.gameTime = 0;
        this.isGameOver = false;

        document.getElementById('game-over').style.display = 'none';
        document.getElementById('game-over-overlay').style.display = 'none';
        this.isGameOver = false;
        this.gameTime = 0;

        this.nextLevel();

        highscore.add(this.level.player.score);
    }

    Game.prototype.nextLevel = function () {
        var currentLevelNr = this.level && this.level.nr || 0;
        this.setLevel(currentLevelNr + 1);
    };

    Game.prototype.setLevel = function (nr) {
        if (!Level[nr]) {
            this.gameOver();
            return;
        }
        this.level = new Level[nr]({
            player: this.player,
            canvas: this.canvas
        });
    };

    // Update game objects
    Game.prototype.update = function (dt) {
        this.gameTime += dt;
        this.handleInput(dt);
        for (var n = 0; n < this.level.trolls.length; n++) {
            this.trollMovement(this.level.trolls[n], dt);
        }

        this.spiderMovement(dt);

        this.updateEntities(dt);

        levelPanel.render({
            nr: this.level.nr,
            hp: this.level.player.hp,
            maxHp: this.level.player.maxHp
        });

        scorePanel.render(this.level.player.score.calculate());

        highscorePanel.render({
            list: highscore.sort().take(5)
        });

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

        for(var i=0;i<this.level.spiders.length;i++)
        {
            var moveFunctions = [this.moveEnemyUp, this.moveEnemyDown, this.moveEnemyLeft, this.moveEnemyRight];
            var index = Math.floor(Math.random() * moveFunctions.length);

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
            this.level.player.score.bulletFired += 1;
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
                // Add this.level.player.score.bulletHits
                this.level.player.score.bulletHits += 1;

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
        for (var n = 0; n < this.level.trolls.length; n++) {
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
        //ctx.fillStyle = terrainPattern;
        //ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render the player if the game isn't over
        if(!this.isGameOver) {
            for (var n = 0; n < this.level.caves.length; n++) {
                this.renderEntity(this.level.caves[n]);
            }
            for (var n = 0; n < this.level.trees.length; n++) {
                this.renderEntity(this.level.trees[n]);
            }
            for (var n = 0; n < this.level.trolls.length; n++) {
                this.renderEntity(this.level.trolls[n]);
            }
            this.renderEntity(this.level.player);
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

    Game.prototype.checkHitTree = function (tree) {
        // Unable player to walk through trees

        if(entitiesCollides(this.level.player, tree)) {

            if (this.level.player.pointedAt() == 'up') {
                this.level.player.pos[1] = tree.pos[1] + tree.sprite.size[1] + 1;
            }
            if (this.level.player.pointedAt() == 'down') {
                this.level.player.pos[1] = tree.pos[1] - this.level.player.sprite.size[1];
            }
            if (this.level.player.pointedAt() == 'right') {
                this.level.player.pos[0] = tree.pos[0] - this.level.player.sprite.size[0];
            }
            if (this.level.player.pointedAt() == 'left') {
                this.level.player.pos[0] = tree.pos[0] + tree.sprite.size[0] + 1;
            }
        }
    };

    Game.prototype.checkHitTroll = function (troll) {
        // Unable player to walk through trees
        if(troll && entitiesCollides(this.level.player, troll)) {
            
            if (this.level.player.pointedAt() == 'up') {
                this.level.player.pos[1] = troll.pos[1] + troll.sprite.size[1] + 1;
            }
            if (this.level.player.pointedAt() == 'down') {
                this.level.player.pos[1] = troll.pos[1] - this.level.player.sprite.size[1];
            }
            if (this.level.player.pointedAt() == 'right') {
                this.level.player.pos[0] = troll.pos[0] - this.level.player.sprite.size[0];
            }
            if (this.level.player.pointedAt() == 'left') {
                this.level.player.pos[0] = troll.pos[0] + troll.sprite.size[0] + 1;
            }

            this.damagePlayer(this.level.player, troll.damage);
            if(!this.level.player.invulnerable){
                this.level.player.setInvulnerable();
            }
        }
    };

    Game.prototype.checkHitSpiders = function () {
        //Check if spiders catch Züper Alex
        for(var i=0;i<this.level.spiders.length;i++){
            var spider = this.level.spiders[i];
            if(spider && entitiesCollides(this.level.player, spider)) {
                this.damagePlayer(this.level.player, spider.damage);
                if(!this.level.player.invulnerable){
                    this.level.player.setInvulnerable();
                }
            }
        }
    };

    Game.prototype.damagePlayer = function(player, damage){
        if(!player.invulnerable){
            player.decreaseHp(damage);
            if (player.hp <= 0){
                this.gameOver();
            }
        }

    };

    Game.prototype.checkPickUpBomb = function () {
        for(var i = 0; i < this.level.bombs.length; i++){
            var bomb = this.level.bombs[i];
            if(bomb && entitiesCollides(this.level.player, bomb)) {
                this.level.player.bomb = bomb;
                bomb.pos = this.level.player.pos;
                this.level.bombs.splice(i,1);
            }
        }
    };

    Game.prototype.bulletsHitTroll = function (troll, index) {
        //Check if bullets hit troll

        var that = this;

        this.bulletsHitsEnemy(troll, function(){

            if (troll && troll.hp <= 0) {
                that.level.trolls.splice(index, 1);

                that.level.trollsKilled += 1;
                that.level.player.score.trollsKilled += 1;

                logger.debug('Killed troll at ' + troll.pos);

                that.level.player.score.trollScore += troll.killScore();

                if (!that.level.completed && that.level.goalsFulfilled()) {

                    that.showNewLevel();
                    that.level.completed = true;

                } else {
                    var levelNr = that.level.nr;
                    setTimeout(function () {
                        if (levelNr != that.level.nr) return;
                        that.level.spawnTroll({
                            level: troll.level + 1
                        });
                    }, 2000);
                }
            };
        });
    };

    Game.prototype.showNewLevel = function () {
        newLevelOverlay.render({
            nr: this.level.nr + 1
        });

        setTimeout(function (game) {
            newLevelOverlay.unrender();
            game.nextLevel();
        }, 2000, this);
    }

    Game.prototype.bulletsHitTree = function () {
        // Check if bullets hit trees
        for(var j=0; j<this.level.player.shotsFired.length; j++) {
            var bullet = this.level.player.shotsFired[j];

            for(var i=0;i<this.level.trees.length;i++)
            {
                var tree = this.level.trees[i];
                var treespritesize = tree.sprite.size;

                if(bullet && entitiesCollides(this.level.trees[i], bullet)) {
                    // Damage Tree
                    this.level.trees[i].decreaseHp(this.level.player.shotsFired[j].damage);

                    if (tree.hp <= 0) {

                        tree.killTree();
                        // this.level.trees.splice(i, 1);

                        logger.debug('Destroyed tree at ' + tree.pos);

                        if (!this.level.completed && this.level.goalsFulfilled()) {
                            this.showNewLevel();
                            this.level.completed = true;
                        }
                    }

                    // Add this.level.player.score.bulletHits
                    this.level.player.score.bulletHits += 1;

                    // Add an explosion
                    this.level.explosions.push({
                        pos: bullet.pos,
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

        if (!this.level.spiders.length) return;
        // Check if bullets hit trees
        for(var j=0; j<this.level.player.shotsFired.length; j++) {
            var bullet = this.level.player.shotsFired[j];


            for(var i=0;i<this.level.spiders.length;i++)
            {
                var spidersize = this.level.spiders[i].sprite.size;

                if(bullet && entitiesCollides(this.level.spiders[i], bullet)) {
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
                    logger.debug('Killed spider at ' + bullet.pos);

                    this.level.player.score.spidersKilled += 1;
                    this.level.player.score.bulletHits += 1;

                    if(this.level.spiders.length < numOfSpiders)
                    {
                        var self = this;
                        var levelNr = self.level.nr;
                        setTimeout(function () {
                        if (levelNr != self.level.nr) return;

                            self.level.spawnSpider();

                        }, 7000);
                    }
                }
            }
        }
    };

    window.Game = Game;
})();
