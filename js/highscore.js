(function () {
    function Highscore(opts) {
        opts = opts || {};
        this.storage = opts.storage || 'highscore';
        this.list = [];
        this.load();
    }

    Highscore.prototype.load = function () {
        var list = JSON.parse(localStorage.getItem(this.storage)) || [];
        for (var n = 0; n < list.length; n++) {
            list[n] = new Scores(list[n]);
        }
        this.list = list;
        return this;
    };

    Highscore.prototype.save = function () {
        localStorage.setItem(this.storage, JSON.stringify(this.list));
        return this;
    };

    Highscore.prototype.add = function (score) {
        this.list.push(score);
        return this;
    };

    window.Highscore = Highscore;
})();
