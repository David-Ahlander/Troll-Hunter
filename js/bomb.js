(function () {
    function Bomb(options) {
        options = options || {};
        this.dir = options.dir;
        this.pos =  options.pos;
        this.sprite = new Sprite('img/bomb.png', [0, 0], [31, 31]);
    }

    Bomb.prototype = new Weapon({
        speed: 50,
        damage: 50
    });

    window.Bomb = Bomb;
})();

