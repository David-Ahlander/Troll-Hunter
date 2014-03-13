(function () {
    function PanelView (options) {
        options = options || {};
        this.element  = options.element;
        this.template = options.template;
    }

    PanelView.prototype.render = function (data) {
        this.element.innerHTML = Mustache.render(this.template, data);
    };

    window.PanelView = PanelView;
})();
