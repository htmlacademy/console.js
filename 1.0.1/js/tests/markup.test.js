(function () {
  'use strict';

  /**
   * Console modes
   * @enum {string}
   */
  const Mode = {
    LOG: `log`,
    DIR: `dir`,
    PREVIEW: `preview`,
    PROP: `prop`,
    ERROR: `error`,
    LOG_HTML: `log-html`
  };

  /* eslint no-undefined: 0 */

  const Console = window.Console;

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
  // class Person {
  //   constructor(val) {
  //     if (val === 123) {
  //       this._bar = val;
  //     }
  //   }
  // }
  //
  // const arrowFn1 = (bar = 123) => {return 123;};
  // const arrowFn2 = (bar = 123) => {`sssssssssssssssssssssssssssssssssssssssss`};
  // const arrowFn3 = (bar = 123) => {`sssssssssssssssssssssssssssssssssssssssssss`};
  // function plainFn (bar456 = 123) {return 123;}
  // const exprFn = function (bar1 = 123) {return 123;}
  // const exprNamedFn = function named (bar2 = 123) {return 123;}
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
    const cons = new Console(document.body);
    after(() => {
      document.body.innerHTML = ``;
    });
    it(`any primitive has class "item--primitive"`, () => {
      const primitiveEls = [
        cons.createTypedView(str1, defaultMode).el,
        cons.createTypedView(primitiveNumber, defaultMode).el,
        cons.createTypedView(sym, defaultMode).el,
        cons.createTypedView(NaN, defaultMode).el,
        cons.createTypedView(null, defaultMode).el,
        cons.createTypedView(true, defaultMode).el,
        cons.createTypedView(undefined, defaultMode).el
      ];
      assert(primitiveEls.every((el) => {
        return el.classList.contains(`item--primitive`);
      }));
    });
    it(`string`, () => {
      const el = cons.createTypedView(str1, defaultMode).el;
      assert(
          el.classList.contains(`item--primitive`) &&
          el.classList.contains(`c-string`) &&
          el.textContent === str1
      );
    });
    it(`string in prop mode should contain nowrap class`, () => {
      const el = cons.createTypedView(str1, Mode.PROP).el;
      assert(
          el.classList.contains(`item--primitive`) &&
          el.classList.contains(`c-string`) &&
          el.classList.contains(`nowrap`) &&
          el.textContent === str1
      );
    });
    it(`string in preview mode should contain nowrap class`, () => {
      const el = cons.createTypedView(str1, Mode.PREVIEW).el;
      assert(
          el.classList.contains(`item--primitive`) &&
          el.classList.contains(`c-string`) &&
          el.classList.contains(`nowrap`) &&
          el.textContent === str1
      );
    });
    it(`multiline string`, () => {
      const el = cons.createTypedView(str2, defaultMode).el;
      assert(
          el.classList.contains(`item--primitive`) &&
          el.classList.contains(`c-string`) &&
          str2.includes(el.textContent)
      );
    });
    it(`number`, () => {
      const el = cons.createTypedView(primitiveNumber, defaultMode).el;
      assert(
          el.classList.contains(`item--primitive`) &&
          el.classList.contains(`c-number`) &&
          el.textContent === primitiveNumber.toString()
      );
    });
    it(`symbol`, () => {
      const el = cons.createTypedView(sym, defaultMode).el;
      assert(
          el.classList.contains(`item--primitive`) &&
          el.classList.contains(`c-symbol`) &&
          el.textContent === sym.toString()
      );
    });
    it(`NaN`, () => {
      const el = cons.createTypedView(NaN, defaultMode).el;
      assert(
          el.classList.contains(`item--primitive`) &&
          el.classList.contains(`c-number`) &&
          el.textContent === `NaN`
      );
    });
    it(`null`, () => {
      const el = cons.createTypedView(null, defaultMode).el;
      assert(
          el.classList.contains(`item--primitive`) &&
          el.classList.contains(`c-null`) &&
          el.textContent === `null`
      );
    });
    it(`boolean`, () => {
      const el = cons.createTypedView(true, defaultMode).el;
      assert(
          el.classList.contains(`item--primitive`) &&
          el.classList.contains(`c-boolean`) &&
          el.textContent === `true`
      );
    });
    it(`undefined`, () => {
      const el = cons.createTypedView(undefined, defaultMode).el;
      assert(
          el.classList.contains(`item--primitive`) &&
          el.classList.contains(`c-undefined`) &&
          el.textContent === `undefined`
      );
    });
  });

  // describe(`Check functions: `, () => {
  // const cons = new Console(document.body);
  // after(() => {
  //   document.body.innerHTML = ``;
  // });
  //   const fnEls = [
  //     cons.createTypedView(arrowFn1, Mode.PREVIEW).el,
  //     cons.createTypedView(plainFn, Mode.PREVIEW).el,
  //     cons.createTypedView(exprFn, Mode.PREVIEW).el,
  //     cons.createTypedView(exprNamedFn, Mode.PREVIEW).el,
  //     cons.createTypedView(Person, Mode.PREVIEW).el
  //   ];
  //   it(`any function has class "item_function"`, () => {
  //     assert(fnEls.every((el) => {
  //       return el.classList.contains(`item_function`);
  //     }));
  //   });
  //   it(`any function in preview === "f"`, () => {
  //     assert(fnEls.every((el) => {
  //       return el.textContent === `f`;
  //     }));
  //   });
  //   it(`class dir and prop`, () => {
  //     const classEls = [
  //       cons.createTypedView(Person, Mode.DIR).el,
  //       cons.createTypedView(Person, Mode.PROP).el
  //     ];
  //     assert(classEls.every((el) => {
  //       return el.textContent.startsWith(`class ${Person.name}`);
  //     }));
  //   });
  // });

}());

//# sourceMappingURL=markup.test.js.map
