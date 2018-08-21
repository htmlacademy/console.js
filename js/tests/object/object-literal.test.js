import {Env} from "../../enums";

const Console = window.Console;

const getConsole = (container, params = {}) => {
  return new Console(container, Object.assign(params, {env: Env.TEST}));
};

const getFirstItemInRow = (containerEl) => {
  return containerEl.querySelector(`.console__row > .console__item`);
};

const cont = document.createElement(`div`);
cont.classList.add(`console-container`);
document.body.appendChild(cont);

let cons = null;
describe(`OBJECT LITERAL:`, () => {
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  it(`item header has right properties`, () => {
    cons = getConsole(cont);
    const fn = function (val) {
      return val;
    };
    const obj = {a: 1, b: `2`, c: [3], d: /re/, e: fn};
    cons.log(obj);
    const el = getFirstItemInRow(cont);
    const keyEls = [...el.querySelectorAll(`.head__content > .entry-container__entry > .entry-container__key`)];
    assert(keyEls.length === 5 && keyEls.every((keyEl) => obj[keyEl.textContent]));
  });

  it(`item body has right properties`, () => {
    cons = getConsole(cont, {
      common: {
        expandDepth: 1
      }
    });
    const fn = function (val) {
      return val;
    };
    const obj = {a: 1, b: `2`, c: [3], d: /re/, e: fn};
    cons.log(obj);
    const el = getFirstItemInRow(cont);
    const keyEls = [...el.querySelectorAll(`.item__content > .entry-container__entry > .entry-container__key`)];
    assert(keyEls.length === 6 && keyEls.every((keyEl) => obj[keyEl.textContent])); // 5 props + __proto__
  });

  it(`item body has right properties order`, () => {
    cons = getConsole(cont, {
      common: {
        expandDepth: 1
      }
    });
    const fn = function (val) {
      return val;
    };
    const obj = {c: [3], d: /re/, e: fn, a: 1, b: `2`};
    const objKeysConcatenated = `abcde__proto__`;
    cons.log(obj);
    const el = getFirstItemInRow(cont);
    const keyEls = [...el.querySelectorAll(`.item__content > .entry-container__entry > .entry-container__key`)];
    assert(keyEls.map((keyEl) => keyEl.textContent).join(``) === objKeysConcatenated);
  });
});
