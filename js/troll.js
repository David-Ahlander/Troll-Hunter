(function () {
    function Troll(opts) {
        opts = opts || {};
        this.pos = opts.pos;
        this.maxHp = opts.maxHp || this.maxHp;
        // Adds health bar to troll.
        this.healthBar = new HealthBar(this, [50, 0], [120, 10]);
    }

    Troll.prototype = {
        hp:     5,
        maxHp:  5,
        delay:  500,
        speed:  100,
        sprite: new Sprite('img/troll.png', [0, 0], [200, 160])
    };

    Troll.prototype.resetHp = function () {
        this.hp = this.maxHp;
    };

    Troll.prototype.delay = function () {
        this.delay; //FIXME
    };

    window.Troll = Troll;
})();
