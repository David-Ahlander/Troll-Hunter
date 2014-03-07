(function () {
    function Bullet(options) {
        options     =  options || {};
        this.dir    =  options.dir;
        this.pos    =  options.pos;
        this.sprite = new Sprite('img/IonShot.png', [0, 0], [21, 21]);
    }

    Bullet.prototype = new Weapon();

    window.Bullet = Bullet;
})();
