(function () {
    function levelGoalsMixin() {
        this.goals = [];
        this.addGoal = addGoal;
        this.goalsFulfilled = goalsFulfilled;
    }

    function addGoal(title, doneFunction) {
        this.goals.push(new Goal({
            title: title,
            done: doneFunction
        }));
        return this;
    }

    function goalsFulfilled() {
        if (!this.goals.length) return false;
        for (var n = 0; n < this.goals.length; n++) {
            if (!this.goals[n].done.call(this)) return false;
        }
        return true;
    }

    window.levelGoalsMixin = levelGoalsMixin;
})();
