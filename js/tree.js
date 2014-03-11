(function() {
    function Tree(options) {
        options = options || {};
        this.pos = options.pos || [0, 0];
        this.sprite = new Sprite('img/tree.png', [0, 0], [120, 108]);
        this.healthBar = new HealthBar(this, [35, 0], [50, 5]);
    }

    Tree.prototype = {
        hp: 100,
        maxHp: 100,
        killed: false
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

    Tree.prototype.killTree = function () {

        if (!this.killed) {
        this.sprite.url = 'img/dead-tree.png';
        this.sprite.size = [77, 60];
        this.pos = [this.pos[0] + 15, this.pos[1] + 48];
        this.healthBar = undefined;
        };
        this.killed = true;


        return this;

    };

    window.Tree = Tree;
})();
