// Thanks to http://stackoverflow.com/a/8894528/38743
(function($) {
  if ($.fn.style) {
    return;
  }
  var escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };
  var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
  if (!isStyleFuncSupported) {
    CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
      return this.getAttribute(a);
    };
    CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority) {
      this.setAttribute(styleName, value);
      var priority = typeof priority != 'undefined' ? priority : '';
      if (priority !== '') {
        var rule = new RegExp(escape(styleName) + '\\s*:\\s*' + escape(value) +
                              '(\\s*;)?', 'gmi');
        this.cssText = this.cssText.replace(rule, styleName + ': ' + value +
                                            ' !' + priority + ';');
      }
    };
    CSSStyleDeclaration.prototype.removeProperty = function(a) {
      return this.removeAttribute(a);
    };
    CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
      var rule = new RegExp(escape(styleName) +
                            '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?', 'gmi');
      return rule.test(this.cssText) ? 'important' : '';
    }
  }
  $.fn.style = function(styleName, value, priority) {
    var node = this.get(0);
    if (typeof node === 'undefined') {
      return this;
    }
    var style = this.get(0).style;
    if (typeof styleName !== 'undefined') {
      if (typeof value !== 'undefined') {
        priority = typeof priority !== 'undefined' ? priority : '';
        style.setProperty(styleName, value, priority);
        return this;
      } else {
        return style.getPropertyValue(styleName);
      }
    } else {
      return style;
    }
  };
})(jQuery);
