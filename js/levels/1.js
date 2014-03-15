(function() {
    var nr = 1;

    function Level(options) {
        options = options || {};
        this.nr = nr;
        this.init(options);
    };

    levelMixin.call(Level.prototype);

    window.Level[nr] = Level;
})();
