import {createTypedView} from '../utils';

// declare vars here

describe(`Object view`, () => {
  it(`log`, () => {
    const el = createTypedView({a: 123}, `log`).el;
    assert(el.classList.contains(`console__item_object`));
  });
  // it dir, error ...
});
