(function () {
    function Troll(options) {
        options = options || {};
        this.pos = options.pos;
        this.maxHp = options.maxHp || this.maxHp;

        this.setLevel(options.level || 1);
        this.hp = this.maxHp;
        this.healthBar = new HealthBar(this, {
            pos: [50, 0],
            size: [120, 10]
        });
    }

    Troll.prototype = {
        damage: 5,
        delay:  500,
        speed:  50,
        sprite: new Sprite('img/troll.png', [0, 0], [200, 160], 5,
                                   [0, 1])
    };

    Troll.prototype.resetHp = function () {
        this.hp = this.maxHp;
    };

    Troll.prototype.killScore = function() {
        return this.level * 10;
    };

    Troll.prototype.setLevel = function(level) {
        var baseHp = 5;
        this.maxHp = baseHp * Math.pow(2, level - 1);
        this.level = level;
    };

    window.Troll = Troll;
})();
