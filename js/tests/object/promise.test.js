import {getFirstItemInRow, getHeadEntries, getBodyEntries, getInfoEl, getProtoEntry} from "../test-helpers";
import {Env} from "../../enums";

const Console = window.Console;

const getConsole = (container, params = {}) => {
  return new Console(container, Object.assign(params, {env: Env.TEST}));
};

let cons = null;
describe(`Promise:`, () => {
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  describe(`Should check spesial value:`, () => {
    it(`Resolved:`, (done) => {
      cons = getConsole(document.body);

      const obj = new Promise((res) => res(`test`));
      obj.foo = `test`;
      obj.bar = 123;

      cons.log(obj);
      setTimeout(() => {
        const el = getFirstItemInRow();

        const entries = getHeadEntries(el);

        assert(entries.length === 3, `different number of properties`);
        assert(entries[0].keyEl.innerText.trim() === `<resolved>`, `first value's key ins't a [[PromiseStatus]]`);
        assert(entries[0].valueContEl.innerText.trim() === `test`, `first value's value ins't a [[PromiseValue]]`);
        done();
      }, 0);
    });

    it(`Rejected:`, (done) => {
      cons = getConsole(document.body);

      const obj = new Promise((res, rej) => rej(`Some error`));
      obj.foo = `test`;
      obj.bar = 123;
      obj.fb = 4;

      cons.log(obj);
      setTimeout(() => {
        const el = getFirstItemInRow();

        const entries = getHeadEntries(el);

        assert(entries.length === 4, `different number of properties`);
        assert(entries[0].keyEl.innerText.trim() === `<rejected>`, `first value's key ins't a [[PromiseStatus]]`);
        assert(entries[0].valueContEl.innerText.trim() === `Some error`, `first value's value ins't a [[PromiseValue]]`);
        done();
      }, 0);
    });

    it(`Pending:`, (done) => {
      cons = getConsole(document.body);

      const obj = new Promise((res) => setTimeout(() => {
        res();
      }, 10000));
      obj.foo = `test`;

      cons.log(obj);
      setTimeout(() => {
        const el = getFirstItemInRow();

        const entries = getHeadEntries(el);

        assert(entries.length === 2, `different number of properties`);
        assert(entries[0].keyEl.innerText.trim() === `<pending>`, `first value's key ins't a [[PromiseStatus]]`);
        assert(entries[0].valueContEl === null || entries[0].valueContEl.innerText === ``, `first value's value ins't a [[PromiseValue]]`);
        done();
      }, 0);
    });
  });
  describe(`Should check body:`, () => {
    it(`Resolved:`, (done) => {
      cons = getConsole(document.body, {
        common: {
          expandDepth: 1
        }
      });

      const obj = new Promise((res) => res(123456));
      obj.foo = `test`;
      obj.bar = 123;

      cons.log(obj);
      setTimeout(() => {
        const el = getFirstItemInRow();

        const entries = getBodyEntries(el);

        assert(entries.length === 5, `different number of properties`); // 2 + [[PromiseStatus]] + [[PromiseValue]] + __proto__

        const promiseStatusEntry = entries.find((entry) => entry.keyEl.innerText.trim() === `[[PromiseStatus]]`);

        assert.exists(promiseStatusEntry, `body isn't contains [[PromiseStatus]] special property`);
        assert.strictEqual(
            promiseStatusEntry.valueContEl.innerText.trim(),
            `resolved`,
            `body's [[PromiseStatus]] special property has incorrect value`
        );

        const promiseValueEntry = entries.find((entry) => entry.keyEl.innerText.trim() === `[[PromiseValue]]`);
        assert.strictEqual(
            promiseValueEntry.valueContEl.innerText.trim(),
            `123456`,
            `body's [[PromiseStatus]] special property has incorrect value`
        );

        assert.exists(promiseValueEntry, `body isn't contains [[PromiseValue]] special property`);
        done();
      }, 0);
    });

    it(`Rejected:`, (done) => {
      cons = getConsole(document.body, {
        common: {
          expandDepth: 1
        }
      });

      const obj = new Promise((res, rej) => rej(`errroroooorr`));
      obj.foo = `test`;

      cons.log(obj);
      setTimeout(() => {
        const el = getFirstItemInRow();

        const entries = getBodyEntries(el);

        assert(entries.length === 4, `different number of properties`); // 1 + [[PromiseStatus]] + [[PromiseValue]] + __proto__

        const promiseStatusEntry = entries.find((entry) => entry.keyEl.innerText.trim() === `[[PromiseStatus]]`);

        assert.exists(promiseStatusEntry, `body isn't contains [[PromiseStatus]] special property`);
        assert.strictEqual(
            promiseStatusEntry.valueContEl.innerText.trim(),
            `rejected`,
            `body's [[PromiseStatus]] special property has incorrect value`
        );

        const promiseValueEntry = entries.find((entry) => entry.keyEl.innerText.trim() === `[[PromiseValue]]`);
        assert.strictEqual(
            promiseValueEntry.valueContEl.innerText.trim(),
            `errroroooorr`,
            `body's [[PromiseStatus]] special property has incorrect value`
        );

        assert.exists(promiseValueEntry, `body isn't contains [[PromiseValue]] special property`);
        done();
      }, 0);
    });

    it(`Pending:`, (done) => {
      cons = getConsole(document.body, {
        common: {
          expandDepth: 1
        }
      });

      const obj = new Promise((res) => setTimeout(() => {
        res();
      }, 10000));
      obj.foo = `test`;
      obj.bar = 89;

      cons.log(obj);
      setTimeout(() => {
        const el = getFirstItemInRow();

        const entries = getBodyEntries(el);

        assert(entries.length === 5, `different number of properties`); // 2 + [[PromiseStatus]] + [[PromiseValue]] + __proto__

        const promiseStatusEntry = entries.find((entry) => entry.keyEl.innerText.trim() === `[[PromiseStatus]]`);

        assert.exists(promiseStatusEntry, `body isn't contains [[PromiseStatus]] special property`);
        assert.strictEqual(
            promiseStatusEntry.valueContEl.innerText.trim(),
            `pending`,
            `body's [[PromiseStatus]] special property has incorrect value`
        );

        const promiseValueEntry = entries.find((entry) => entry.keyEl.innerText.trim() === `[[PromiseValue]]`);
        assert.strictEqual(
            promiseValueEntry.valueContEl.innerText.trim(),
            `undefined`,
            `body's [[PromiseStatus]] special property has incorrect value`
        );

        assert.exists(promiseValueEntry, `body isn't contains [[PromiseValue]] special property`);
        done();
      }, 0);
    });

    describe(`Should check prototype name:`, () => {
      it(`item info contains correct prototype/constructor name`, (done) => {
        cons = getConsole(document.body);

        const obj = new Promise((res) => res(456));
        cons.log(obj);

        setTimeout(() => {
          const el = getFirstItemInRow();

          const infoEl = getInfoEl(el);
          assert.strictEqual(infoEl.innerText.trim(), `Promise`, `incorrect name`);
          done();
        }, 0);
      });

      it(`__proto__ property has correct prototype/constructor name`, (done) => {
        cons = getConsole(document.body, {
          common: {
            expandDepth: 1
          }
        });

        const obj = new Promise((res) => res(456));
        cons.log(obj);

        setTimeout(() => {
          const el = getFirstItemInRow();

          const protoEntryInfoEl = getInfoEl(getProtoEntry(el).valueContEl);
          assert.strictEqual(protoEntryInfoEl.innerText.trim(), `Promise`, `incorrect name`);
          done();
        }, 0);
      });
    });
  });
});
