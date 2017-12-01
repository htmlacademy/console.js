import ObjectView from './object/object-view';
import ArrayView from './array/array-view';
import FunctionView from './function/function-view';
import PrimitiveView from './function/primitive-view';

export const getElement = (htmlMarkup) => {
  const div = document.createElement(`div`);
  div.innerHTML = htmlMarkup;
  return div.firstElementChild;
};

const primitiveTypeofs = ['undefined', 'number', 'string', 'boolean', 'symbol', 'object'];

export const getPrimitiveType = (val) => {

  const type = typeof val;

  if (!primitiveTypeofs.includes(type)) {
    throw new Error('Unknown primitive type: ' + type);
  }

  return type;
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
export const createTypedView = (val, isInvokedInPreview) => {
  let view;
  let res = {
    isPrimitive: false
  };
  const type = typeof val;
  switch (type) {
    case 'function':
      view = new FunctionView(val, false);
      break;
    case 'object':
      // TODO: check instanceof Date, String, Boolean, Number
      if (val !== null) {
        if (Array.isArray(val)) {
          view = new ArrayView(val, isInvokedInPreview);
        } else {
          view = new ObjectView(val, isInvokedInPreview)
        }
        break;
      }
    default:
      res.type = getPrimitiveType(val);
      res.isPrimitive = true;
      break;
  }
  return res;
};
