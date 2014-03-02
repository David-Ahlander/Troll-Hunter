(function() {
    function Tree(pos) {
        var x = pos[0],
            y = pos[1];
        this.sprite = new Sprite('img/tree.png', [x, y], [120, 108]);
    }

    Tree.prototype.randomizePosition = function () {
        this.pos = [Math.random() * 680, Math.random() * 492];
    };

    window.Tree = Tree;
})();
