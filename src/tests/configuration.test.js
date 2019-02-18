import {ViewType} from "../enums";

const Console = window.Console;

// WARNING: karma mocha adds "should" property to every object
const obj = {};
const arr = [obj];
const fn = (bar = 123) => {
  return bar;
};
arr.push(arr);
arr.fn = fn;
fn.arr = arr;
fn.obj = obj;
fn.fn = fn;
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
    common: {
      excludePropertiesFromAutoexpand: [`__proto__`]
    }
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
  it(`root object should be opened on 6 levels`, () => {
    cons = getConsole(div, {
      object: {
        expandDepth: 4,
        minFieldsToAutoexpand: 1
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 14 && arrLength === 13 && fnLength === 13);
  });
  it(`root object should not be opened because of minFieldsToAutoexpand === 5`, () => {
    cons = getConsole(div, {
      object: {
        expandDepth: 1,
        minFieldsToAutoexpand: 5
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
        excludeViewTypesFromAutoexpand: [ViewType.ARRAY]
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 8 && arrLength === 0 && fnLength === 7);
  });
  it(`root object should be opened with excluding nested functions`, () => {
    cons = getConsole(div, {
      object: {
        expandDepth: 4,
        excludeViewTypesFromAutoexpand: [ViewType.FUNCTION]
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 8 && arrLength === 7 && fnLength === 0);
  });
  it(`root object should be opened with excluding nested arrays and functions`, () => {
    cons = getConsole(div, {
      object: {
        expandDepth: 4,
        excludeViewTypesFromAutoexpand: [ViewType.ARRAY, ViewType.FUNCTION]
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths(cons);
    assert(objLength === 4 && arrLength === 0 && fnLength === 0);
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
        expandDepth: 4,
        minFieldsToAutoexpand: 1
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    const bool = objLength === 13 && arrLength === 14 && fnLength === 13;
    assert(bool);
  });
  it(`root array should not be opened because of minFieldsToAutoexpand === 5`, () => {
    cons = getConsole(div, {
      array: {
        expandDepth: 2,
        minFieldsToAutoexpand: 7
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
        excludeViewTypesFromAutoexpand: [ViewType.OBJECT]
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 8 && fnLength === 7);
  });
  it(`root array should be opened with excluding nested functions`, () => {
    cons = getConsole(div, {
      array: {
        expandDepth: 4,
        excludeViewTypesFromAutoexpand: [ViewType.FUNCTION]
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 7 && arrLength === 8 && fnLength === 0);
  });
  it(`root array should be opened with excluding nested objects and functions`, () => {
    cons = getConsole(div, {
      array: {
        expandDepth: 4,
        excludeViewTypesFromAutoexpand: [ViewType.OBJECT, ViewType.FUNCTION]
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 4 && fnLength === 0);
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
        minFieldsToAutoexpand: 1
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 13 && arrLength === 13 && fnLength === 14);
  });
  it(`root function should not be opened because of minFieldsToAutoexpand === 10`, () => {
    cons = getConsole(div, {
      function: {
        expandDepth: 2,
        minFieldsToAutoexpand: 10
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
        excludeViewTypesFromAutoexpand: [ViewType.OBJECT]
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 7 && fnLength === 8);
  });
  it(`root function should be opened with excluding nested arrays`, () => {
    cons = getConsole(div, {
      function: {
        expandDepth: 4,
        excludeViewTypesFromAutoexpand: [ViewType.ARRAY]
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 7 && arrLength === 0 && fnLength === 8);
  });
  it(`root function should be opened with excluding nested objects and arrays`, () => {
    cons = getConsole(div, {
      function: {
        expandDepth: 4,
        excludeViewTypesFromAutoexpand: [ViewType.OBJECT, ViewType.ARRAY]
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 0 && fnLength === 4);
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
