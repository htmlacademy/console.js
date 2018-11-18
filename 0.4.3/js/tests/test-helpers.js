var testHelpers = (function (exports) {
  'use strict';

  const getFirstItemInRow = () => {
    return document.querySelector(`.console__row > .console__item`);
  };

  const getHeadEntries = (el) => {
    const entryEls = [...el.querySelectorAll(`.head__content > .entry-container__entry`)];

    return entryEls.map((entryEl) => ({
      keyEl: entryEl.querySelector(`.entry-container__key`),
      valueContEl: entryEl.querySelector(`.entry-container__value-container`)
    }));
  };

  const getBodyEntries = (el) => {
    const entryEls = [...el.querySelectorAll(`.item__content > .entry-container__entry`)];

    return entryEls.map((entryEl) => ({
      keyEl: entryEl.querySelector(`.entry-container__key`),
      valueContEl: entryEl.querySelector(`.entry-container__value-container`)
    }));
  };

  const getInfoEl = (el) => {
    return el.querySelector(`.head__info`);
  };

  const getProtoEntry = (el) => {
    return getBodyEntries(el)
      .find((entry) => entry.keyEl.innerText.trim() === `__proto__`);
  };

  exports.getFirstItemInRow = getFirstItemInRow;
  exports.getHeadEntries = getHeadEntries;
  exports.getBodyEntries = getBodyEntries;
  exports.getInfoEl = getInfoEl;
  exports.getProtoEntry = getProtoEntry;

  return exports;

}({}));

//# sourceMappingURL=test-helpers.js.map
