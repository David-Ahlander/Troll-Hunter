(function () {
    function Level(opts) {
        opts = opts || {};
        this.nr     = opts.nr;
        this.player = opts.player;
        this.scores = opts.scores;
        this.canvas = opts.canvas;

        this.cave = {
            pos: [0, 0],
            sprite: new Sprite('img/cave.png', [0, 0], [210, 141])
        };

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
        this.cave.pos = [590, this.canvas.height - 600];

        for (var n = 0; n < this.trees.length; n++) {
            this.trees[n].randomizePosition();
        }
        this.spawnTree();
        this.spawnTree();
        this.spawnTree();

        this.spawnTroll();
    };

    Level.prototype.spawnTroll = function (opts) {
        opts = opts || {};
        opts.pos = opts.pos || [500, canvas.height - 600];
        this.trolls.push(new Troll(opts));
    };

    Level.prototype.spawnTree = function () {
        this.trees.push(new Tree().randomizePosition());
    };

    window.Level = Level;
})();
