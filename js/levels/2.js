(function() {
    var nr = 2;

    function Level(options) {
        options = options || {};
        this.nr = nr;
        this.init(options);
    };

    levelMixin.call(Level.prototype);
    levelGoalsMixin.call(Level.prototype);

    window.Level[nr] = Level;
})();
