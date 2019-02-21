const Console = window.Console;

const cont = document.createElement(`div`);
cont.classList.add(`console-container`);
document.body.appendChild(cont);

describe(`Should check common console behaviours`, () => {
  it(`new Console(container) inserts .console inside of container`, () => {
    const cons = new Console(cont); // eslint-disable-line no-unused-vars
    assert(document.querySelector(`.console-container > .console`));
    cont.innerHTML = ``;
  });

  it(`every console method appends .console__item inside of .console__row`, () => {
    const cons = new Console(cont); // eslint-disable-line no-unused-vars
    cons.log(1);
    cons.logHTML(1);
    cons.dir(1);
    cons.error(1);

    cons.logOutput(1);
    cons.prompt(1);
    assert([...document.querySelectorAll(`.console__row > .console__item`)].length === 6);
    cont.innerHTML = ``;
  });
});
