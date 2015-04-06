(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};

    var support = global.placekeeper.support;
    var data = global.placekeeper.data;
    var utils = global.placekeeper.utils;
    var elems = global.placekeeper.elements;
    var events = global.placekeeper.events;
    var polyfill = global.placekeeper.polyfill;
    var isEnabled = false;
    var settings = {
        defaultLoopDuration: 100
    };
    var loopInterval = null;
    var isFocusEnabled = true;
    var isLiveUpdateEnabled = false;

    function isPlacekeeperEnabled() {
        return isEnabled;
    }

    function isPlacekeeperFocusEnabled() {
        return isFocusEnabled;
    }

    function isPlacekeeperLiveUpdateEnabled() {
        return isLiveUpdateEnabled;
    }

    function hasElementsThatNeedPlaceholder(elements) {

        if (!elements) {
            return false;
        }

        for (var i = 0; i < elements.length; i++) {
            if (support.needsToShowPlaceHolder(elements[i])) {
                return true;
            }
        }

        return false;
    }

    function needsToSetPlaceholder() {
        var needsPlaceholder = hasElementsThatNeedPlaceholder(elems.getInputElements());

        if (needsPlaceholder === false) {
            needsPlaceholder = hasElementsThatNeedPlaceholder(elems.getTextareaElements());
        }

        return needsPlaceholder;
    }

    function hasDisabledLiveUpdates() {
        return data.hasLiveUpdatesAttrSetToFalse(document.documentElement) ||
               data.hasLiveUpdatesAttrSetToFalse(document.body);
    }

    function hasFocusDisabled() {
        return data.hasFocusAttrSetToFalse(document.documentElement) ||
               data.hasFocusAttrSetToFalse(document.body);
    }

    function setupElement(element, placeholderValue) {
        data.setValueAttr(element, placeholderValue);
        data.setEventsAttr(element);
        elems.createPasswordCloneIfNeeded(element);
        events.addSubmitEvent(element.form);
        events.addEventListeners(element);
        if (element !== support.safeActiveElement()) {
            polyfill.__showPlaceholder(element);
        }
    }

    function needsSetup(element) {
        return support.isSupportedType(utils.getElementType(element)) &&
               !data.hasEventsAttrSetToTrue(element);
    }

    function hasPlaceholderValueChanged(element, placeholder) {
        return data.hasValueAttr(element) &&
               data.getValueAttr(element) !== placeholder;
    }

    function checkForPlaceholder(element) {
        var placeholder = utils.getPlaceholderValue(element);

        if (!placeholder) {
            return;
        }

        if (needsSetup(element)) {
            setupElement(element, placeholder);
            return;
        }

        if (hasPlaceholderValueChanged(element, placeholder)) {
            data.setValueAttr(element, placeholder);
        }
    }

    function setupPlaceholders() {
        elems.forEachElement(checkForPlaceholder);
    }

    function placekeeperLoop() {
        if (hasFocusDisabled()) {
            isFocusEnabled = false;
        }

        isEnabled = needsToSetPlaceholder();

        if (!isEnabled) {
            return;
        }

        setupPlaceholders();
    }

    function init() {
        if (support.hasNativePlaceholderSupport()) {
            return;
        }
        clearInterval(loopInterval);
        placekeeperLoop();
        if (!hasDisabledLiveUpdates()) {
            isLiveUpdateEnabled = true;
            // main loop
            loopInterval = setInterval(placekeeperLoop, settings.defaultLoopDuration);
        } else {
            isLiveUpdateEnabled = false;
        }
    }

    function disablePlacekeeper() {
        isEnabled = false;
        clearInterval(loopInterval);
        elems.forEachForm(events.removeSubmitEvent);
        elems.forEachElement(events.removeEvents);
        elems.forEachElement(data.removeDataAttrs);
        elems.forEachElement(elems.removePasswordCloneIfExists);
    }

    elems.getElements();
    events.addUnloadListener();
    init();

    // Expose public methods
    global.placekeeper.isEnabled = isPlacekeeperEnabled;
    global.placekeeper.enable = init;
    global.placekeeper.disable = disablePlacekeeper;
    global.placekeeper.isFocusEnabled = isPlacekeeperFocusEnabled;
    global.placekeeper.isLiveUpdateEnabled = isPlacekeeperLiveUpdateEnabled;

    // Exposed private methods
    global.placekeeper.priv = {
        __global: global,
        __init: init,
        __settings: settings,
        __setupPlaceholders: setupPlaceholders,
        __hasElementsThatNeedPlaceholder: hasElementsThatNeedPlaceholder
    };

}(this));
