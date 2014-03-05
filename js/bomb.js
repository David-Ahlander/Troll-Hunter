(function () {
    function Bomb(pos) {
        this.pos = pos;
    }

    Bomb.prototype = {
        damage: 50,
        speed:  50,
        sprite: new Sprite('img/bomb.png', [0, 0], [31, 31]),
        armed: false
    }

    window.Bomb = Bomb;
})();

