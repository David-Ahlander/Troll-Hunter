(function () {
    function entityMixin() {
        this.midPos = midPos;
        return this;
    }

    function midPos() {
        var posX = this.pos[0] + (this.sprite.size[0] / 2);
        var posY = this.pos[1] + (this.sprite.size[0] / 4);
        return [posX, posY];
    }

    window.entityMixin = entityMixin;
})();
