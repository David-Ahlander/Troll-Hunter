(function () {
    function OverlayView (options) {
      options = options || {};
      this.element  = options.element
      this.template = options.template
    }

    OverlayView.prototype.render = function (data) {
        this.element.innerHTML = Mustache.render(this.template, data);
        this.element.classList.add('active');
    };

    OverlayView.prototype.unrender = function () {
        this.element.classList.remove('active');
    };

    window.OverlayView = OverlayView;
})();
