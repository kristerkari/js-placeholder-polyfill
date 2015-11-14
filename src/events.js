(function() {

  var utils = placekeeper.utils;
  var data = placekeeper.data;
  var mode = placekeeper.mode;
  var elems = placekeeper.elements;
  var polyfill = placekeeper.polyfill;
  var support = placekeeper.support;
  var handlers = {};
  var keydownVal;

  function isActiveAndHasPlaceholderSet(element) {
    return data.hasActiveAttrSetToTrue(element) &&
           element.value === data.getValueAttr(element);
  }

  function hidePlaceholderOnSubmit(element) {
    if (!isActiveAndHasPlaceholderSet(element)) {
      return;
    }
    polyfill.hidePlaceholder(element);
  }

  function showPlaceholderAfterSubmit(element) {
    if (support.needsToShowPlaceHolder(element)) {
      polyfill.showPlaceholder(element);
    }
  }

  function shouldNotHidePlaceholder(element) {
    return !mode.isPlacekeeperFocusEnabled() &&
           isActiveAndHasPlaceholderSet(element);
  }

  function createFocusHandler(element) {
    return function() {
      if (shouldNotHidePlaceholder(element)) {
        utils.moveCaret(element, 0);
      } else if (isActiveAndHasPlaceholderSet(element)) {
        polyfill.hidePlaceholder(element);
        if (element.value === "") {
          utils.moveCaret(element, 0);
        }
      }
    };
  }

  function createBlurHandler(element) {
    return function() {
      if (isActiveAndHasPlaceholderSet(element)) {
        return;
      }
      polyfill.showPlaceholder(element);
    };
  }

  function createSubmitHandler(form) {
    return function() {
      // Clear the placeholder values so they don't get submitted
      elems.forEachChildInput(form, hidePlaceholderOnSubmit);
      setTimeout(function() {
        elems.forEachChildInput(form, showPlaceholderAfterSubmit);
      }, 10);
    };
  }

  function createKeydownHandler(element) {
    return function(evt) {
      keydownVal = element.value;

      // Prevent the use of certain keys
      // (try to keep the cursor before the placeholder).
      if (isActiveAndHasPlaceholderSet(element) && support.isBadKey(evt.keyCode)) {
        utils.preventDefault(evt);
        return false;
      }
    };
  }

  function createKeyupHandler(element) {
    return function() {
      if (keydownVal != null && keydownVal !== element.value) {
        polyfill.hidePlaceholder(element);
      }

      // If the element is now empty we need to show the placeholder
      if (element.value === "") {
        element.blur();
        utils.moveCaret(element, 0);
      }
    };
  }

  function createClickHandler(element) {
    return function() {
      if (element === support.safeActiveElement() &&
          isActiveAndHasPlaceholderSet(element)) {
        utils.moveCaret(element, 0);
      }
    };
  }

  var create = {
    keydown: createKeydownHandler,
    keyup: createKeyupHandler,
    click: createClickHandler,
    blur: createBlurHandler,
    focus: createFocusHandler,
    submit: createSubmitHandler
  };

  var hideOnInputEvents = [
    "keydown",
    "keyup",
    "click"
  ];

  function createEventListener(element, evt) {
    handlers[evt] = create[evt](element);
    utils.addEventListener(element, evt, handlers[evt]);
  }

  function destroyEventListener(element, evt) {
    utils.removeEventListener(element, evt, handlers[evt]);
    delete handlers[evt];
  }

  function addEventListeners(element) {
    createEventListener(element, "blur");
    if (elems.hasPasswordClone(element)) {
      element = elems.getPasswordClone(element);
    }
    createEventListener(element, "focus");

    // If the placeholder should hide on input rather than on focus we need
    // additional event handlers
    if (!mode.isPlacekeeperFocusEnabled()) {
      utils.each(hideOnInputEvents, function(evt) {
        createEventListener(element, evt);
      });
    }

  }

  function hasHideOnInputHandlers() {
    return "keydown" in handlers &&
           "keyup" in handlers &&
           "click" in handlers;
  }

  function removeEventListeners(element) {
    destroyEventListener(element, "blur");
    if (elems.hasPasswordClone(element)) {
      element = elems.getPasswordClone(element);
    }
    destroyEventListener(element, "focus");
    if (hasHideOnInputHandlers()) {
      utils.each(hideOnInputEvents, function(evt) {
        destroyEventListener(element, evt);
      });
    }
  }

  function addSubmitListener(form) {
    createEventListener(form, "submit");
  }

  function removeSubmitListener(form) {
    destroyEventListener(form, "submit");
  }

  function hidePlaceholder(element) {
    if (!isActiveAndHasPlaceholderSet(element)) {
      return;
    }
    polyfill.removePlaceholder(element, false);
  }

  function clearPlaceholders() {
    elems.forEachElement(hidePlaceholder);
  }

  function addSubmitEvent(form) {
    if (form == null || data.hasSubmitAttrSetToTrue(form)) {
      return;
    }
    addSubmitListener(form);
    // Set a flag on the form so we know it's been handled
    // (forms can contain multiple inputs).
    data.setSubmitAttr(form);
  }

  function addUnloadListener() {
    // Disabling placeholders before unloading the page
    // ensures that placeholder values are not stored
    // in browser's "form data" store.
    utils.addEventListener(global, "beforeunload", clearPlaceholders);
  }

  function removeEvents(element) {
    if (!data.hasEventsAttrSetToTrue(element)) {
      return;
    }
    removeEventListeners(element);
  }

  function removeSubmitEvent(form) {
    if (!data.hasSubmitAttrSetToTrue(form)) {
      return;
    }
    removeSubmitListener(form);
    data.removeSubmitAttr(form);
  }

  placekeeper.events = {
    handlers: handlers,
    addEventListeners: addEventListeners,
    addSubmitEvent: addSubmitEvent,
    addUnloadListener: addUnloadListener,
    removeEvents: removeEvents,
    removeSubmitEvent: removeSubmitEvent
  };

}());
