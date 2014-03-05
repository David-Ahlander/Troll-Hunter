(function() {
    function Tree(opts) {
        opts = opts || {};
        this.pos = opts.pos || [0, 0];
        this.sprite = new Sprite('img/tree.png', [0, 0], [120, 108]);
    }

    Tree.prototype.randomizePosition = function () {
        this.pos = [Math.random() * 680, Math.random() * 492];
        return this;
    };

    window.Tree = Tree;
})();
