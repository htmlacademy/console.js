export const getFirstItemInRow = () => {
  return document.querySelector(`.console__row > .console__item`);
};

export const getEntries = (el) => {
  const entryEls = [...el.querySelectorAll(`.head__content > .entry-container__entry`)];

  return entryEls.map((entryEl) => ({
    keyEl: entryEl.querySelector(`.entry-container__key`),
    valueContEl: entryEl.querySelector(`.entry-container__value-container`)
  }));
};
