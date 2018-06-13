export const getElement = (htmlMarkup) => {
  const div = document.createElement(`div`);
  div.innerHTML = htmlMarkup;
  return div.firstElementChild;
};

export const customizer = (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
  return void 0;
};

export const checkObjectisPrototype = (obj) => {
  return obj && obj.hasOwnProperty(`constructor`) &&
    typeof obj.constructor === `function` &&
    obj.constructor.hasOwnProperty(`prototype`) &&
    typeof obj.constructor.prototype === `object` &&
    obj.constructor.prototype === obj;
};
