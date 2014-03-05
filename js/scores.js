(function (){
    function Scores (opts) {
        opts = opts || {};
        this.bulletFired   = opts.bulletFired   || 0;
        this.bulletHits    = opts.bulletHits    || 0;
        this.trollsKilled  = opts.trollsKilled  || 0;
        this.spidersKilled = opts.spidersKilled || 0;
        this.accuracy      = opts.accuracy      || 0;
        this.total         = opts.total         || 0;
    }

    Scores.prototype.setAccuracy = function(){

        var accuracy = 0;

        if (this.bulletHits && this.bulletFired) {
            accuracy = Math.round(this.bulletHits / this.bulletFired * 100);
        }

        this.accuracy = accuracy;
    }


    Scores.prototype.setTotal = function(){

        var totalScore = 0;

        totalScore = this.accuracy + (this.trollsKilled * 10) + this.spidersKilled;
        this.total = totalScore;
    };

    Scores.prototype.calculate = function () {
        this.setAccuracy();
        this.setTotal();
        return this;
    };

    window.Scores = Scores;

})();
