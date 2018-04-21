import Console from "../main";
import {ViewType} from "../enums";

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

describe(`Check depth object`, () => {
  let cons = null;
  beforeEach(() => {
    const div = document.createElement(`div`);
    div.classList.add(`console`);
    document.body.appendChild(div);
  });
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  it(`root object should be opened on 2 levels`, () => {
    cons = new Console(document.querySelector(`.console`), {
      object: {
        expandDepth: 2,
        minFieldsToExpand: 1
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 2 && arrLength === 1 && fnLength === 1);
  });
  it(`root object should not be opened because of minFieldsToExpand === 4 and obj has 3 fields`, () => {
    cons = new Console(document.querySelector(`.console`), {
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
    cons = new Console(document.querySelector(`.console`), {
      object: {
        expandDepth: 4,
        exclude: [ViewType.ARRAY]
      }
    });
    cons.log(obj);
    // console.log(document.querySelector(`.console`).innerHTML);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 8 && arrLength === 0 && fnLength === 6);
  });
  it(`root object should be opened with excluding nested functions`, () => {
    cons = new Console(document.querySelector(`.console`), {
      object: {
        expandDepth: 5,
        exclude: [ViewType.FUNCTION]
      }
    });
    cons.log(obj);
    // console.log(document.querySelector(`.console`).innerHTML);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 16 && arrLength === 15 && fnLength === 0);
  });
  it(`root object should be opened with excluding nested arrays and functions`, () => {
    cons = new Console(document.querySelector(`.console`), {
      object: {
        expandDepth: 7,
        exclude: [ViewType.ARRAY, ViewType.FUNCTION]
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 7 && arrLength === 0 && fnLength === 0);
  });
});

describe(`Check depth array`, () => {
  let cons = null;
  beforeEach(() => {
    const div = document.createElement(`div`);
    div.classList.add(`console`);
    document.body.appendChild(div);
  });
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  it(`root array should be opened on 2 levels`, () => {
    cons = new Console(document.querySelector(`.console`), {
      array: {
        expandDepth: 2,
        minFieldsToExpand: 1
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 1 && arrLength === 2 && fnLength === 0);
  });
  it(`root array should not be opened because of minFieldsToExpand === 3 and array has 2 fields`, () => {
    cons = new Console(document.querySelector(`.console`), {
      array: {
        expandDepth: 2,
        minFieldsToExpand: 3
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 0 && fnLength === 0);
  });
  it(`root array should be opened with excluding nested objects`, () => {
    cons = new Console(document.querySelector(`.console`), {
      array: {
        expandDepth: 4,
        exclude: [ViewType.OBJECT]
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 4 && fnLength === 0);
  });
  it(`root array should be opened with excluding nested functions`, () => {
    cons = new Console(document.querySelector(`.console`), {
      array: {
        expandDepth: 6,
        exclude: [ViewType.FUNCTION]
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 31 && arrLength === 32 && fnLength === 0);
  });
  it(`root array should be opened with excluding nested objects and functions`, () => {
    cons = new Console(document.querySelector(`.console`), {
      array: {
        expandDepth: 2,
        exclude: [ViewType.OBJECT, ViewType.FUNCTION]
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 2 && fnLength === 0);
  });
});

describe(`Check depth function DIR`, () => {
  let cons = null;
  beforeEach(() => {
    const div = document.createElement(`div`);
    div.classList.add(`console`);
    document.body.appendChild(div);
  });
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  it(`root function should be opened on 4 levels`, () => {
    cons = new Console(document.querySelector(`.console`), {
      function: {
        expandDepth: 3,
        minFieldsToExpand: 1
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    console.log(objLength, arrLength, fnLength);
    assert(objLength === 4 && arrLength === 3 && fnLength === 3);
  });
  it(`root function should not be opened because of minFieldsToExpand === 4 and array has 3 fields`, () => {
    cons = new Console(document.querySelector(`.console`), {
      function: {
        expandDepth: 2,
        minFieldsToExpand: 4
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 0 && fnLength === 0);
  });
  it(`root function should be opened with excluding nested objects`, () => {
    cons = new Console(document.querySelector(`.console`), {
      function: {
        expandDepth: 4,
        exclude: [ViewType.OBJECT]
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 3 && fnLength === 2);
  });
  it(`root function should be opened with excluding nested arrays`, () => {
    cons = new Console(document.querySelector(`.console`), {
      function: {
        expandDepth: 3,
        exclude: [ViewType.ARRAY]
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 3 && arrLength === 0 && fnLength === 3);
  });
  it(`root function should be opened with excluding nested objects and arrays`, () => {
    cons = new Console(document.querySelector(`.console`), {
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
  let cons = null;
  beforeEach(() => {
    const div = document.createElement(`div`);
    div.classList.add(`console`);
    document.body.appendChild(div);
  });
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  it(`maxFieldsInHead === 2`, () => {
    cons = new Console(document.querySelector(`.console`), {
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
    cons = new Console(document.querySelector(`.console`), {
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
    cons = new Console(document.querySelector(`.console`), {
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
