(function () {
    function Cave(options) {
        options = options || {};
        this.pos = options.pos || [0, 0];
    }

    Cave.prototype = {
        sprite: new Sprite('img/cave.png', [0, 0], [210, 141])
    };

    window.Cave = Cave;
})();
