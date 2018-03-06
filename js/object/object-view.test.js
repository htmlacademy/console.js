import {createTypedView} from '../utils';
const assert = chai.assert;
describe(`Object view`, () => {
  it(`should`, () => {
    const el = createTypedView({a: 123}, `log`).el;
    assert(el.classList.contains(`console__item_object`));
  });
});
