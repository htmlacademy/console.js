export const getFirstItemInRow = () => {
  return document.querySelector(`.console__row > .console__item`);
};

export const getHeadEntries = (el) => {
  const entryEls = [...el.querySelectorAll(`.head__content > .entry-container__entry`)];

  return entryEls.map((entryEl) => ({
    keyEl: entryEl.querySelector(`.entry-container__key`),
    valueContEl: entryEl.querySelector(`.entry-container__value-container`)
  }));
};

export const getBodyEntries = (el) => {
  const entryEls = [...el.querySelectorAll(`.item__content > .entry-container__entry`)];

  return entryEls.map((entryEl) => ({
    keyEl: entryEl.querySelector(`.entry-container__key`),
    valueContEl: entryEl.querySelector(`.entry-container__value-container`)
  }));
};

export const getInfoEl = (el) => {
  return el.querySelector(`.head__info`);
};

export const getProtoEntry = (el) => {
  return getBodyEntries(el)
    .find((entry) => entry.keyEl.innerText.trim() === `__proto__`);
};
