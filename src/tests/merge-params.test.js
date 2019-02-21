import mergeParams from '../utils/merge-params';

const presetA = {
  object: {
    maxFieldsToAutoexpand: 5,
    excludeViewTypesFromAutoexpand: [`object`]
  },
  common: {
    excludeViewTypesFromAutoexpand: [`function`]
  }
};

const presetB = {
  object: {
    maxFieldsToAutoexpand: 10
  },
  common: {
    expandDepth: 1,
    excludeViewTypesFromAutoexpand: [`array`]
  }
};

const expectedResultAB = {
  object: {
    maxFieldsToAutoexpand: 10,
    excludeViewTypesFromAutoexpand: [`object`]
  },
  common: {
    expandDepth: 1,
    excludeViewTypesFromAutoexpand: [`function`, `array`]
  }
};

const expectedResultBA = {
  object: {
    maxFieldsToAutoexpand: 5,
    excludeViewTypesFromAutoexpand: [`object`]
  },
  common: {
    expandDepth: 1,
    excludeViewTypesFromAutoexpand: [`array`, `function`]
  }
};

describe(`Merge params in right order`, () => {
  it(`presetA first presetB second`, () => {
    const configs = [presetA, presetB];
    const result = mergeParams(configs);
    expect(result).to.deep.equal(expectedResultAB);
  });

  it(`presetB first presetA second`, () => {
    const configs = [presetB, presetA];
    const result = mergeParams(configs);
    expect(result).to.deep.equal(expectedResultBA);
  });

  it(`Array with configs isn't modified`, () => {
    const configs = [presetB, presetA];
    const copiedConfigs = [presetB, presetA];
    mergeParams(configs);
    expect(configs).to.deep.equal(copiedConfigs);
  });
});
