(function(F, global) {
  "use strict";

  var originalGetValueMethod = F.Element.Methods.getValue;
  var originalGetValueStatic = F.Element.getValue;
  var originalGlobal = $F;

  function getValue(originalFn, elem) {
    if (elem.getAttribute("data-placeholder-active")) {
      return "";
    }
    /*jshint validthis: true */
    return originalFn.call(this, elem);
  }

  if (!global.placekeeper.support.hasNativePlaceholderSupport()) {

    $F = function(elem) {
      return getValue.call(this, originalGlobal, elem);
    };

    F.Element.getValue = function(elem) {
      return getValue.call(this, originalGetValueStatic, elem);
    };

    Element.addMethods(["INPUT", "TEXTAREA"], {
      getValue: function(elem) {
        return getValue.call(this, originalGetValueMethod, elem);
      }
    });
  }

}(this.Form, this));
