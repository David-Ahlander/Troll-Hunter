(function () {
    function Logger(options) {
    }

    Logger.prototype = {
        enabled: false
    }

    Logger.prototype.debug = function (message) {
        if (this.enabled) {
            console.log(message);
        }
    };

    Logger.prototype.enable = function () {
        this.enabled = true;
    };

    Logger.prototype.disable = function () {
        this.enabled = false;
    };

    window.Logger = Logger;
})();


