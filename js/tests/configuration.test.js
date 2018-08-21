import {ViewType, Env} from "../enums";

const Console = window.Console;

const obj = {};
const arr = [obj];
arr.push(arr);
// arr.fn = fn;
const fn = (bar = 123) => {
  return bar;
};
fn.arr = arr;
fn.obj = obj;
obj.obj = obj;
obj.arr = arr;
obj.fn = fn;

const getLengths = () => {
  const objects = Array.from(
      document.querySelectorAll(`.item--object:not(.hidden) > .item__content.entry-container--object:not(.hidden)`)
  );
  const arrays = Array.from(
      document.querySelectorAll(`.item--array:not(.hidden) > .item__content.entry-container--array:not(.hidden)`)
  );
  const functions = Array.from(
      document.querySelectorAll(`.item--function:not(.hidden) > .item__content.entry-container--function:not(.hidden)`)
  );
  return {
    objLength: objects.length,
    arrLength: arrays.length,
    fnLength: functions.length
  };
};

const getConsole = (container, params) => {
  return new Console(container, Object.assign(params, {
    env: Env.TEST,
    // common: {
    //   excludeProperties: [`__proto__`]
    // }
  }));
};

const div = document.createElement(`div`);
div.classList.add(`console`);
document.body.appendChild(div);

let cons = null;

describe(`Check depth object`, () => {
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  it(`root object should be opened on 2 levels`, () => {
    cons = getConsole(div, {
      object: {
        expandDepth: 2,
        minFieldsToExpand: 1
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 3 && arrLength === 1 && fnLength === 1);
  });
  it(`root object should not be opened because of minFieldsToExpand === 4 and obj has 3 fields`, () => {
    cons = getConsole(div, {
      object: {
        expandDepth: 2,
        minFieldsToExpand: 4
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 0 && fnLength === 0);
  });
  it(`root object should be opened with excluding nested arrays`, () => {
    cons = getConsole(div, {
      object: {
        expandDepth: 4,
        exclude: [ViewType.ARRAY]
      }
    });
    cons.log(obj);
    // console.log(document.querySelector(`.console`).innerHTML);
    const {objLength, arrLength, fnLength} = getLengths();
    // console.log(`objLength: ${objLength}, arrLength: ${arrLength}, fnLength: ${fnLength}`);
    assert(objLength === 13 && arrLength === 0 && fnLength === 65);
  });
  it(`root object should be opened with excluding nested functions`, () => {
    cons = getConsole(div, {
      object: {
        expandDepth: 5,
        exclude: [ViewType.FUNCTION]
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 30 && arrLength === 22 && fnLength === 0);
  });
  it(`root object should be opened with excluding nested arrays and functions`, () => {
    cons = getConsole(div, {
      object: {
        expandDepth: 3,
        exclude: [ViewType.ARRAY, ViewType.FUNCTION]
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths(cons);
    assert(objLength === 5 && arrLength === 0 && fnLength === 0);
  });
});

describe(`Check depth array`, () => {
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  it(`root array should be opened on 2 levels`, () => {
    cons = getConsole(div, {
      array: {
        expandDepth: 2,
        minFieldsToExpand: 1
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    const bool = objLength === 1 && arrLength === 3 && fnLength === 0;
    assert(bool);
  });
  it(`root array should not be opened because of minFieldsToExpand === 4 and array has 2 fields`, () => {
    cons = getConsole(div, {
      array: {
        expandDepth: 2,
        minFieldsToExpand: 4
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 0 && fnLength === 0);
  });
  it(`root array should be opened with excluding nested objects`, () => {
    cons = getConsole(div, {
      array: {
        expandDepth: 4,
        exclude: [ViewType.OBJECT]
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    // console.log(`objLength: ${objLength}, arrLength: ${arrLength}, fnLength: ${fnLength}`);
    assert(objLength === 0 && arrLength === 8 && fnLength === 97);
  });
  it(`root array should be opened with excluding nested functions`, () => {
    cons = getConsole(div, {
      array: {
        expandDepth: 3,
        exclude: [ViewType.FUNCTION]
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 6 && arrLength === 6 && fnLength === 0);
  });
  it(`root array should be opened with excluding nested objects and functions`, () => {
    cons = getConsole(div, {
      array: {
        expandDepth: 2,
        exclude: [ViewType.OBJECT, ViewType.FUNCTION]
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 3 && fnLength === 0);
  });
});

describe(`Check depth function DIR`, () => {
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  it(`root function should be opened on 4 levels`, () => {
    cons = getConsole(div, {
      function: {
        expandDepth: 4,
        minFieldsToExpand: 1
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    // console.log(`objLength: ${objLength}, arrLength: ${arrLength}, fnLength: ${fnLength}`);
    assert(objLength === 14 && arrLength === 11 && fnLength === 72);
  });
  it(`root function should not be opened because of minFieldsToExpand === 5 and function has 3 fields`, () => {
    cons = getConsole(div, {
      function: {
        expandDepth: 2,
        minFieldsToExpand: 7
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 0 && fnLength === 0);
  });
  it(`root function should be opened with excluding nested objects`, () => {
    cons = getConsole(div, {
      function: {
        expandDepth: 4,
        exclude: [ViewType.OBJECT]
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    // console.log(`objLength: ${objLength}, arrLength: ${arrLength}, fnLength: ${fnLength}`);
    assert(objLength === 0 && arrLength === 5 && fnLength === 46);
  });
  it(`root function should be opened with excluding nested arrays`, () => {
    cons = getConsole(div, {
      function: {
        expandDepth: 3,
        exclude: [ViewType.ARRAY]
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 4 && arrLength === 0 && fnLength === 9);
  });
  it(`root function should be opened with excluding nested objects and arrays`, () => {
    cons = getConsole(div, {
      function: {
        expandDepth: 2,
        exclude: [ViewType.OBJECT, ViewType.ARRAY]
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 0 && fnLength === 2);
  });
});

describe(`in head of object must be limited number of fields`, () => {
  const localObj = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7
  };
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  it(`maxFieldsInHead === 2`, () => {
    cons = getConsole(div, {
      object: {
        maxFieldsInHead: 2
      }
    });
    cons.log(localObj);
    const headElementsEl = Array.from(
        document.querySelectorAll(`.entry-container--head .entry-container__entry`)
    );
    assert(headElementsEl.length === 2);
  });
  it(`maxFieldsInHead === 5`, () => {
    cons = getConsole(div, {
      object: {
        maxFieldsInHead: 5
      }
    });
    cons.log(localObj);
    const headElementsEl = Array.from(
        document.querySelectorAll(`.entry-container--head .entry-container__entry`)
    );
    assert(headElementsEl.length === 5);
  });
  it(`maxFieldsInHead === 8, but object contains 7 fields`, () => {
    cons = getConsole(div, {
      object: {
        maxFieldsInHead: 8
      }
    });
    cons.log(localObj);
    const headElementsEl = Array.from(
        document.querySelectorAll(`.entry-container--head .entry-container__entry`)
    );
    assert(headElementsEl.length === 7);
  });
});
