(function (){
    function Score (options) {
        options = options || {};
        this.bulletFired   = options.bulletFired   || 0;
        this.bulletHits    = options.bulletHits    || 0;
        this.trollsKilled  = options.trollsKilled  || 0;
        this.spidersKilled = options.spidersKilled || 0;
        this.accuracy      = options.accuracy      || 0;
        this.total         = options.total         || 0;
        this.trollScore    = options.trollScore    || 0;
    }

    Score.prototype.setAccuracy = function(){

        var accuracy = 0;

        if (this.bulletHits && this.bulletFired) {
            accuracy = Math.round(this.bulletHits / this.bulletFired * 100);
        }

        this.accuracy = accuracy;
    }


    Score.prototype.setTotal = function(){

        var totalScore = 0;

        totalScore = this.accuracy + this.trollScore + this.spidersKilled;
        this.total = totalScore;
    };

    Score.prototype.calculate = function () {
        this.setAccuracy();
        this.setTotal();
        return this;
    };

    window.Score = Score;

})();


troll = new Troll;

// Troll dör
// scores.trollScore += troll.killScore();
// troll.setLevel(troll.level + 1);
// troll.resetHp();


// newTroll = new Troll({level: troll.level + 1});


