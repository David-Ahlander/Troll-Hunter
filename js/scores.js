(function (){
    function Scores(){
        this.bulletFired = 0;
        this.bulletHits = 0;
        this.trollsKilled = 0;
        this.spidersKilled = 0;
       
    }

    Scores.prototype.reset = function(){

    }

    Scores.prototype.accuracy = function(){

        var accuracy = 0;
        
        if (this.bulletHits && this.bulletFired) {
            accuracy = Math.round(this.bulletHits / this.bulletFired * 100);
        }

        return accuracy;
    }


    Scores.prototype.total = function(){
        
        var totalScore = 0;

        totalScore = this.accuracy() + (this.trollsKilled * 10) + this.spidersKilled;
        return totalScore;
    };

    window.Scores = Scores;

})();
