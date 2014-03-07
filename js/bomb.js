(function () {
    function Bomb(options) {
        options = options || {};
        this.dir = options.dir;
        this.pos =  options.pos;
        this.sprite = new Sprite('img/bomb.png', [0, 0], [31, 31]);
        this.damage = 45;
        this.aoe = 5;
    }

    Bomb.prototype = new Weapon();

    window.Bomb = Bomb;
})();
