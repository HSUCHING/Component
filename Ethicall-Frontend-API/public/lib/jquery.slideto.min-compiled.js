(function (b) {
  b.fn.slideto = function (a) {
    a = b.extend({ slide_duration: "slow", highlight_duration: 3E3, highlight: true, highlight_color: "#FFFF99" }, a);return this.each(function () {
      obj = b(this);b("body").animate({ scrollTop: obj.offset().top }, a.slide_duration, function () {
        a.highlight && b.ui.version && obj.effect("highlight", { color: a.highlight_color }, a.highlight_duration);
      });
    });
  };
})(jQuery);

//# sourceMappingURL=jquery.slideto.min-compiled.js.map