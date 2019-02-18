import mergeWith from 'lodash.mergewith';

export default (configs) => {
  return mergeWith({}, ...configs.slice(), (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
    return void 0;
  });
};
