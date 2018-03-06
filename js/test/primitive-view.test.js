describe(`Primitive`, () => {
  it(`log`, () => {
    const c = [1, 2, 3];
    console.log(c);
    const consoleEl = document.querySelector(`.console`);
    assert(consoleEl);
  });
});
