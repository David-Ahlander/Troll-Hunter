(function () {
    function Level(options) {
        options = options || {};
        this.nr     = options.nr;
        this.player = options.player;
        this.scores = options.scores;
        this.canvas = options.canvas;

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

    Level.prototype.spawnCave = function (options) {
        options = options || {};
        options.pos = options.pos || [590, this.canvas.height - 600];
        this.caves.push(new Cave(options));
    };

    Level.prototype.spawnTroll = function (options) {
        options = options || {};
        options.pos = options.pos || this.randomCave().midPos();
        this.trolls.push(new Troll(options));
    };

    Level.prototype.spawnTree = function () {
        this.trees.push(new Tree().randomizePosition());
    };

    Level.prototype.randomCave = function () {
        return randomFromArray(this.caves);
    };

    window.Level = Level;
})();
