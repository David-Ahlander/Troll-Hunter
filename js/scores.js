(function (){
    function Scores(){
        this.bulletFired = 0;
        this.bulletHits = 0;
        this.trollsKilled = 0;
        this.spidersKilled = 0;
        this.accuracy = 0;
        this.total = 0;
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
