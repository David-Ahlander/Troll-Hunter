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

        for (var n = 0; n < this.list.length; n++) {
            if (score.total > this.list[n].total) {

                this.list.splice(n, 0, score);
                return this;
            };

        }
       
        this.list.push(score);

        return this;
    };

    Highscore.prototype.mustacheData = function (currentScores) {

        var mustacheData = {
            list: this.list.slice(0, 5)
        };

        currentScores.htmlClass = "current";

        mustacheData.list.push(currentScores);
        mustacheData.list.sort(function(a, b) {
            return a.total < b.total;
        });

        return mustacheData;

    };

    window.Highscore = Highscore;
})();
