(function() {
    function Tree(options) {
        options = options || {};
        this.pos = options.pos || [0, 0];
        this.sprite = new Sprite('img/tree.png', [0, 0], [120, 108]);
        this.healthBar = new HealthBar(this, [0, 0], [120, 10]);
    }

    Tree.prototype = {
        hp: 100,
        maxHp: 100
    };

    entityMixin.call(Tree.prototype);

    Tree.prototype.decreaseHp = function (damage) {
        this.hp -= damage;
        return this;
    }

    Tree.prototype.randomizePosition = function () {
        this.pos = [Math.random() * 680, Math.random() * 492];
        return this;
    };

    window.Tree = Tree;
})();
