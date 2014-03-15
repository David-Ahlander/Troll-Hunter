(function () {
    function levelMixin() {
        this.init           = init;
        this.goalsFulfilled = goalsFulfilled;
        this.allTreesDead   = allTreesDead;
        this.spawnEntities  = spawnEntities;
        this.spawnCave      = spawnCave;
        this.spawnTroll     = spawnTroll;
        this.spawnSpider    = spawnSpider;
        this.spawnTree      = spawnTree;
        this.randomCave     = randomCave;
        this.randomTree     = randomTree;
        return this;
    }

    function init(options) {
        this.player = options.player;
        this.canvas = options.canvas;

        this.caves      = [];
        this.trolls     = [];
        this.spiders    = [];
        this.bullets    = [];
        this.explosions = [];
        this.trees      = [];
        this.bombs      = [];
        this.spawnEntities();

        this.trollsKilled = 0,
        this.completed    = false

        document.getElementById('game-box').className = 'level-' + this.nr;
    }

    function goalsFulfilled() {
        return this.trollsKilled >= 2 &&
               this.allTreesDead();
    }

    function allTreesDead() {
        for (var n = 0; n < this.trees.length; n++) {
            if (this.trees[n].hp > 0) return false;
        }
        return true;
    }

    function spawnEntities() {
        this.player.pos = [20, this.canvas.height / 2];

        this.spawnCave();

        this.spawnTree();
        this.spawnTree();
        this.spawnTree();

        this.spawnSpider();
        this.spawnSpider();
        this.spawnSpider();
        this.spawnSpider();
        this.spawnSpider();

        this.spawnTroll();
    }

    function spawnCave(options) {
        options = options || {};
        options.pos = options.pos || [590, this.canvas.height - 600];
        this.caves.push(new Cave(options));
    }

    function spawnTroll(options) {
        options = options || {};
        options.pos = options.pos || this.randomCave().midPos();
        this.trolls.push(new Troll(options));
    }

    function spawnSpider(options) {
        options = options || {};
        if (!options.pos) {
            var tree = this.randomTree();
            if (!tree) return;
            options.pos = tree.midPos()
        }
        this.spiders.push(new Spider(options));
    }

    function spawnTree() {
        this.trees.push(new Tree().randomizePosition());
    }

    function randomCave() {
        return randomFromArray(this.caves);
    }

    function randomTree() {
        var trees = [];
        for (var n = 0; n < this.trees.length; n++) {
            if (this.trees[n].hp > 0) {
              trees.push(this.trees[n]);
            }
        }
        return randomFromArray(trees);
    }

    window.levelMixin = levelMixin;
})();
