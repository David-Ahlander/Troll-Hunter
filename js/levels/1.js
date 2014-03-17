(function() {
    var nr = 1;

    function Level(options) {
        options = options || {};
        this.nr = nr;
        this.init(options);
    };

    levelMixin.call(Level.prototype);

    Level.prototype.goalsFulfilled = function () {
        return this.trollsKilled >= 2 &&
               this.allTreesDead();
    };

    window.Level[nr] = Level;
})();
