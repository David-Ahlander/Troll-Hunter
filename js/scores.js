(function (){
    function Scores (options) {
        options = options || {};
        this.bulletFired   = options.bulletFired   || 0;
        this.bulletHits    = options.bulletHits    || 0;
        this.trollsKilled  = options.trollsKilled  || 0;
        this.spidersKilled = options.spidersKilled || 0;
        this.accuracy      = options.accuracy      || 0;
        this.total         = options.total         || 0;
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
