(function (){
    function Levels(){

        this.bulletSpeed = 200;
        var scores = new Scores();

    
    };

    Levels.prototype.increaseLevel = function(){

        // for (var i = 0; i < scores.trollsKilled; i++) {
            
        //     this.bulletSpeed = this.bulletSpeed + 1000;

        //     console.log(scores.trollsKilled);

        // };

        return this.bulletSpeed;

        // if (scores.trollsKilled >) {
        //     bulletSpeed = 850;
        //     Troll.prototype.speed = 160;
        //     Spider.prototype.speed = 160;
        // };

    };

    window.Levels = Levels;

})();
