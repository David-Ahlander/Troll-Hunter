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
            // {bulletFired: 10, trollKilled: 1}
            list[n] = new Scores(list[n]);
        }
        console.log(list);
        this.list = list;
        return this;
    };

    Highscore.prototype.save = function () {
        localStorage.setItem(this.storage, JSON.stringify(this.list));
        return this;
    };

    Highscore.prototype.add = function (score) {

        for (var n = 0; n < this.list.length; n++) {
            if (score.total > this.list[n].total) {

                this.list.splice(n, 0, score);
                return this;
            };

        }
       
        this.list.push(score);

        return this;
    };

    window.Highscore = Highscore;
})();
