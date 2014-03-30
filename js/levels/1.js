(function() {
    var nr = 1;

    function Level(options) {
        options = options || {};
        this.nr = nr;
        this.init(options);
    };

    levelMixin.call(Level.prototype);
    levelGoalsMixin.call(Level.prototype);

    Level.prototype
        .addGoal('Döda två troll', function () {
            return this.trollsKilled >= 2;
        })
        .addGoal('Förstör alla träd', function () {
            return this.allTreesDead();
        });

    window.Level[nr] = Level;
})();
