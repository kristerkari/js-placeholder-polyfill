describe("forms", function() {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("when there is an element with placeholder and form attribute inside a form on the page", function() {
    var element;
    var form;

    beforeEach(function(done) {
      element = helpers.createInputElementWithFormAttribute(true);
      form = document.getElementsByTagName("form")[0];
      placekeeper.priv.__setupPlaceholders();
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    describe("and when that form is submitted", function() {

      beforeEach(function() {
        spyOn(placekeeper.polyfill, "hidePlaceholder");
        spyOn(placekeeper.polyfill, "showPlaceholder");
        triggerEvent.html(form, "submit");
      });

      it("should have added data-placeholder-submit to the form", function() {
        expect(form.getAttribute("data-placeholder-submit")).toEqual("true");
      });

      it("should have called polyfill's hidePlaceholder method", function() {
        expect(placekeeper.polyfill.hidePlaceholder).toHaveBeenCalledWith(element);
        expect(placekeeper.polyfill.hidePlaceholder.calls.count()).toEqual(1);
      });

      it("should not have called polyfill's showPlaceholder method", function() {
        expect(placekeeper.polyfill.showPlaceholder).not.toHaveBeenCalled();
        expect(placekeeper.polyfill.showPlaceholder.calls.count()).toEqual(0);
      });

      describe("and after 10ms (when form is submitted)", function() {

        beforeEach(function(done) {
          setTimeout(done, 10);
        });

        it("should have called polyfill's showPlaceholder method", function() {
          expect(placekeeper.polyfill.showPlaceholder).toHaveBeenCalledWith(element);
          expect(placekeeper.polyfill.showPlaceholder.calls.count()).toEqual(1);
        });

      });

    });

    describe("and when disable method is called", function() {
      var submitHandler;

      beforeEach(function() {
        submitHandler = placekeeper.events.handlers.submit;
        spyOn(placekeeper.utils, "removeEventListener");
        placekeeper.disable();
      });

      it("should have called utils.removeEventListener for submit handler", function() {
        expect(placekeeper.utils.removeEventListener)
        .toHaveBeenCalledWith(form, "submit", submitHandler);
      });

      it("should not have data-placeholder-submit set to the from", function() {
        expect(form.getAttribute("data-placeholder-submit")).toEqual(null);
      });

      it("should have deleted the submit handler", function() {
        expect(placekeeper.events.handlers.submit).not.toBeDefined();
      });

    });

  });

  describe("when there is an element without placeholder inside a form on the page", function() {
    var element;
    var form;

    beforeEach(function(done) {
      element = helpers.createInputElementWithForm(false);
      form = document.getElementsByTagName("form")[0];
      placekeeper.priv.__setupPlaceholders();
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    describe("and when that form is submitted", function() {

      beforeEach(function() {
        spyOn(placekeeper.polyfill, "hidePlaceholder");
        spyOn(placekeeper.polyfill, "showPlaceholder");
        triggerEvent.html(form, "submit");
      });

      it("should not have added data-placeholder-submit to the form", function() {
        expect(form.getAttribute("data-placeholder-submit")).toEqual(null);
      });

      it("should not have called polyfill's hidePlaceholder method", function() {
        expect(placekeeper.polyfill.hidePlaceholder).not.toHaveBeenCalled();
        expect(placekeeper.polyfill.hidePlaceholder.calls.count()).toEqual(0);
      });

      it("should not have called polyfill's showPlaceholder method", function() {
        expect(placekeeper.polyfill.showPlaceholder).not.toHaveBeenCalled();
        expect(placekeeper.polyfill.showPlaceholder.calls.count()).toEqual(0);
      });

    });

  });

  describe("when there is an element with placeholder inside a form on the page", function() {
    var element;
    var form;

    beforeEach(function(done) {
      element = helpers.createInputElementWithForm(true);
      form = document.getElementsByTagName("form")[0];
      placekeeper.priv.__setupPlaceholders();
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    describe("and when that form is submitted", function() {

      beforeEach(function() {
        spyOn(placekeeper.polyfill, "hidePlaceholder");
        spyOn(placekeeper.polyfill, "showPlaceholder");
        triggerEvent.html(form, "submit");
      });

      it("should have added data-placeholder-submit to the form", function() {
        expect(form.getAttribute("data-placeholder-submit")).toEqual("true");
      });

      it("should have called polyfill's hidePlaceholder method", function() {
        expect(placekeeper.polyfill.hidePlaceholder).toHaveBeenCalledWith(element);
        expect(placekeeper.polyfill.hidePlaceholder.calls.count()).toEqual(1);
      });

      it("should not have called polyfill's showPlaceholder method", function() {
        expect(placekeeper.polyfill.showPlaceholder).not.toHaveBeenCalled();
        expect(placekeeper.polyfill.showPlaceholder.calls.count()).toEqual(0);
      });

      describe("and after 10ms (when form is submitted)", function() {

        beforeEach(function(done) {
          setTimeout(done, 10);
        });

        it("should have called polyfill's showPlaceholder method", function() {
          expect(placekeeper.polyfill.showPlaceholder).toHaveBeenCalledWith(element);
          expect(placekeeper.polyfill.showPlaceholder.calls.count()).toEqual(1);
        });

      });

    });

    describe("and when disable method is called", function() {
      var submitHandler;

      beforeEach(function() {
        submitHandler = placekeeper.events.handlers.submit;
        spyOn(placekeeper.utils, "removeEventListener");
        placekeeper.disable();
      });

      it("should have called utils.removeEventListener for submit handler", function() {
        expect(placekeeper.utils.removeEventListener)
        .toHaveBeenCalledWith(form, "submit", submitHandler);
      });

      it("should not have data-placeholder-submit set to the from", function() {
        expect(form.getAttribute("data-placeholder-submit")).toEqual(null);
      });

      it("should have deleted the submit handler", function() {
        expect(placekeeper.events.handlers.submit).not.toBeDefined();
      });

    });

  });

});
