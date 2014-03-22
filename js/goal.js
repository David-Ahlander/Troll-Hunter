(function () {
    function Goal(options) {
        options = options || {};
        this.title = options.title;
        this.done  = options.done;
    }

    window.Goal = Goal;
})();
