export const getElement = (htmlMarkup) => {
  const div = document.createElement(`div`);
  div.innerHTML = htmlMarkup;
  return div.firstElementChild;
};
