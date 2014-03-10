(function () {
    function Highscore(options) {
        options = options || {};
        this.storage = options.storage || 'highscore';
        this.list = [];
        this.load();
    }

    Highscore.prototype.load = function () {

        var list = JSON.parse(localStorage.getItem(this.storage)) || [];
        for (var n = 0; n < list.length; n++) {
            list[n] = new Score(list[n]);
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
        score.htmlClass = 'current';

        for (var n = 0; n < this.list.length; n++) {
            this.list[n].htmlClass = undefined;

            if (score.total > this.list[n].total) {

                this.list.splice(n, 0, score);
                return this;
            };
        }

        this.list.push(score);

        return this;
    };

    Highscore.prototype.sort = function () {
        this.list.sort(function (a, b) {
            return b.total - a.total;
        });
        return this;
    };

    Highscore.prototype.take = function (count) {
        return this.list.slice(0, count);
    };

    window.Highscore = Highscore;
})();
