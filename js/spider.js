(function () {
    function Spider(options) {
        options = options || {};
        this.pos = [options.pos[0], options.pos[1]];
    }

    Spider.prototype = {
        hp:    1,
        maxHp: 1,
        delay: 500,
        speed: 200,
        sprite: new Sprite('img/cave_spider.png', [0, 0], [31, 31]),
    }

    Spider.prototype.resetHp = function () {
        this.hp = this.maxHp;
    };

    window.Spider = Spider;
})();

