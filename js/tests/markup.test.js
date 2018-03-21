/* eslint no-undefined: 0 */

// import FunctionView from '../function/function-view';
import {createTypedView} from '../utils';
import {Mode} from '../enums';

// declare consts here
//
// const arr1 = [1, 2, 3];
// const arr2 = [1, 2, 3];
// arr2.test = 123;
// const nestedArr = [1, 2, ``, [1, 2, ``]];
const str1 = `Here is console log`;
const str2 = `
  Here is console log
  sdadsda
asddsd`;
const primitiveNumber = 123;
// const currYearText = `current year: `;
// const currYearDate = (new Date()).getFullYear();
//
// const arr3 = [
//   {key1: `value1`},
//   {key2: `value2`}
// ];
//
class Person {
  constructor(val) {
    if (val === 123) {
      this._bar = val;
    }
  }
}

const arrowFn1 = (bar = 123) => {return 123;};
const arrowFn2 = (bar = 123) => {`sssssssssssssssssssssssssssssssssssssssss`};
const arrowFn3 = (bar = 123) => {`sssssssssssssssssssssssssssssssssssssssssss`};
function plainFn (bar456 = 123) {return 123;}
const exprFn = function (bar1 = 123) {return 123;}
const exprNamedFn = function named (bar2 = 123) {return 123;}
//
// const num = new Number(1)
// const date = new Date();
// const str = new String(`qwe`);
//
// const div = document.querySelector(`div`);
//
// const kot = {
//   cat: {
//     name: `Сергей Сергеевич`,
//     kittens: [{
//       name: `Иван Васильич`,
//       kittens: [
//         {name: `Пётр Иванович`}
//       ]
//     }]
//   }
// };
//
// class Cat {
//   constructor(name, age = 0, male = true) {
//     this.name = name;
//     this.age = age;
//     this.male = male;
//   }
//
//   eat(food) {
//     return `${this.name} ate ${food}`;
//   }
//
//   meow() {
//     return `Мяу!`;
//   }
// }
//
// const o1 = {};
// o1.b = {o1: o1};
// const o2 = {oo: 1, b: ``, arr1, arr2, nestedArr, e: {b: 1}, o1};
// const o3 = {Person, arrowFn1, arrowFn2, arrowFn3, plainFn, exprFn, exprNamedFn};
// const o4 = {num, str};
//
// const cat = new Cat(`Keks`, 2);
// const err = new Error(`new Error`);
// const errObjPlain = new Error(o3);
// const errNum = new Error(num);
// const typeErr = new TypeError(`new TypeError`);
// const int8Arr = new Int8Array();
// const reConstr = new RegExp(`regexpConstr`);
// const reLiteral = /reLiteral/;
const sym = Symbol(`sym`);
// const ab = new ArrayBuffer();

describe(`Check primitives: `, () => {
  const defaultMode = Mode.LOG;
  it(`any primitive has class "console__item_primitive"`, () => {
    const primitiveEls = [
      createTypedView(str1, defaultMode).el,
      createTypedView(primitiveNumber, defaultMode).el,
      createTypedView(sym, defaultMode).el,
      createTypedView(NaN, defaultMode).el,
      createTypedView(null, defaultMode).el,
      createTypedView(true, defaultMode).el,
      createTypedView(undefined, defaultMode).el
    ];
    assert(primitiveEls.every((el) => {
      return el.classList.contains(`console__item_primitive`);
    }));
  });
  it(`string`, () => {
    const el = createTypedView(str1, defaultMode).el;
    assert(
        el.classList.contains(`console__item_primitive`) &&
        el.classList.contains(`string`) &&
        el.textContent === str1
    );
  });
  it(`string prop mode`, () => {
    const el = createTypedView(str1, Mode.PROP).el;
    assert(
        el.classList.contains(`console__item_primitive`) &&
        el.classList.contains(`string`) &&
        el.classList.contains(`string_collapsed`) &&
        el.textContent === str1
    );
  });
  it(`multiline string`, () => {
    const el = createTypedView(str2, defaultMode).el;
    assert(
        el.classList.contains(`console__item_primitive`) &&
        el.classList.contains(`string`) &&
        str2.includes(el.textContent)
    );
  });
  it(`number`, () => {
    const el = createTypedView(primitiveNumber, defaultMode).el;
    assert(
        el.classList.contains(`console__item_primitive`) &&
        el.classList.contains(`number`) &&
        el.textContent === primitiveNumber.toString()
    );
  });
  it(`symbol`, () => {
    const el = createTypedView(sym, defaultMode).el;
    assert(
        el.classList.contains(`console__item_primitive`) &&
        el.classList.contains(`symbol`) &&
        el.textContent === sym.toString()
    );
  });
  it(`NaN`, () => {
    const el = createTypedView(NaN, defaultMode).el;
    assert(
        el.classList.contains(`console__item_primitive`) &&
        el.classList.contains(`NaN`) &&
        el.textContent === `NaN`
    );
  });
  it(`null`, () => {
    const el = createTypedView(null, defaultMode).el;
    assert(
        el.classList.contains(`console__item_primitive`) &&
        el.classList.contains(`null`) &&
        el.textContent === `null`
    );
  });
  it(`boolean`, () => {
    const el = createTypedView(true, defaultMode).el;
    assert(
        el.classList.contains(`console__item_primitive`) &&
        el.classList.contains(`boolean`) &&
        el.textContent === `true`
    );
  });
  it(`undefined`, () => {
    const el = createTypedView(undefined, defaultMode).el;
    assert(
        el.classList.contains(`console__item_primitive`) &&
        el.classList.contains(`undefined`) &&
        el.textContent === `undefined`
    );
  });
});

// describe(`Check functions: `, () => {
//   const fnEls = [
//     createTypedView(arrowFn1, Mode.PREVIEW).el,
//     createTypedView(plainFn, Mode.PREVIEW).el,
//     createTypedView(exprFn, Mode.PREVIEW).el,
//     createTypedView(exprNamedFn, Mode.PREVIEW).el,
//     createTypedView(Person, Mode.PREVIEW).el
//   ];
//   it(`any function has class "console__item_function"`, () => {
//     assert(fnEls.every((el) => {
//       return el.classList.contains(`console__item_function`);
//     }));
//   });
//   it(`any function in preview === "f"`, () => {
//     assert(fnEls.every((el) => {
//       return el.textContent === `f`;
//     }));
//   });
//   it(`class dir and prop`, () => {
//     const classEls = [
//       createTypedView(Person, Mode.DIR).el,
//       createTypedView(Person, Mode.PROP).el
//     ];
//     assert(classEls.every((el) => {
//       return el.textContent.startsWith(`class ${Person.name}`);
//     }));
//   });
// });
