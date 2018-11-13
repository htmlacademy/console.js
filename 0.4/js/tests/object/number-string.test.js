(function () {
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

  /**
   * Console modes
   * @enum {string}
   */

  /**
   * Console environment
   * @enum {string}
   */
  const Env = {
    TEST: `test`
  };

  const Console = window.Console;

  const getConsole = (container, params = {}) => {
    return new Console(container, Object.assign(params, {env: Env.TEST}));
  };

  let cons = null;
  describe(`Number and String:`, () => {
    afterEach(() => {
      cons.clean();
      cons = null;
    });
    describe(`Should check spesial value:`, () => {
      it(`Number:`, () => {
        cons = getConsole(document.body);

        const obj = new Number(12345); // eslint-disable-line
        obj.foo = `test`;
        obj.bar = 123;

        cons.log(obj);

        const el = getFirstItemInRow();

        const entries = getHeadEntries(el);

        assert(entries.length === 3, `different number of properties`);
        assert((
          entries[0].valueContEl.innerText.trim() === `12345` && // headless chrome does return innerText with extra \n
          (entries[0].keyEl === null || entries[0].keyEl.innerText === ``)
        ), `first value isn't a Number's [[PrimitiveValue]]`);
      });

      it(`String:`, () => {
        cons = getConsole(document.body);

        const obj = new String(`Hello test!`); // eslint-disable-line
        obj.foo = `test`;
        obj.bar = 123;

        cons.log(obj);

        const el = getFirstItemInRow();

        const entries = getHeadEntries(el);

        assert(entries.length === 3, `different number of properties`);
        assert((
          entries[0].valueContEl.innerText.trim() === `Hello test!` && // headless chrome does return innerText with extra \n
          (entries[0].keyEl === null || entries[0].keyEl.innerText === ``)
        ), `first value isn't a String's [[PrimitiveValue]]`);
      });
    });
  });

}());

//# sourceMappingURL=number-string.test.js.map
