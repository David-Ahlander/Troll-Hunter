(function () {
    function Spider(pos) {
        this.pos = pos;
    }

    Spider.prototype = {
        hp:    1,
        maxHp: 1,
        delay: 500,
        speed: 50,
        sprite: new Sprite('img/cave_spider.png', [0, 0], [31, 31]),
    }

    Spider.prototype.resetHp = function () {
        this.hp = this.maxHp;
    };

    Spider.prototype.delay = function () {
        this.delay;
    };

    window.Spider = Spider;
})();

