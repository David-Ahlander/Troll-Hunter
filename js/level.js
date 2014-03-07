(function () {
    function Level(opts) {
        opts = opts || {};
        this.nr     = opts.nr;
        this.player = opts.player;
        this.scores = opts.scores;
        this.canvas = opts.canvas;

        this.caves      = [];
        this.trolls     = [];
        this.spiders    = [];
        this.bullets    = [];
        this.explosions = [];
        this.trees      = [];
        this.bombs      = [];
        this.spawnEntities();
    }

    Level.prototype.spawnEntities = function () {
        this.player.pos = [50, this.canvas.height / 2];

        this.spawnCave();

        this.spawnTree();
        this.spawnTree();
        this.spawnTree();

        this.spawnTroll();
    };

    Level.prototype.spawnCave = function (opts) {
        opts = opts || {};
        opts.pos = opts.pos || [590, this.canvas.height - 600];
        this.caves.push(new Cave(opts));
    };

    Level.prototype.spawnTroll = function (opts) {
        opts = opts || {};
        opts.pos = opts.pos || this.randomCave().midPos();
        this.trolls.push(new Troll(opts));
    };

    Level.prototype.spawnTree = function () {
        this.trees.push(new Tree().randomizePosition());
    };

    Level.prototype.randomCave = function () {
        return randomFromArray(this.caves);
    };

    window.Level = Level;
})();
