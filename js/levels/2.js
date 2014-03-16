(function() {
    var nr = 2;

    function Level(options) {
        options = options || {};
        this.nr = nr;
        this.init(options);
    };

    levelMixin.call(Level.prototype);

    Level.prototype.goalsFulfilled = function () {
        return false; // Can never leave level 2
    };

    window.Level[nr] = Level;
})();
