const expect = require('chai').expect;
const beforeEach = require('chai').beforeEach;

const componentProofList = require('../src/component-proof-list-service');

let component;

beforeEach(() => {
  component = {
    variables: [],
    creativeSegments: [],
    personalSegments: [],
    indesignLayerKeys: [],
  };
});

it('returns the right array for personal segments', () => {
  const ps = {};
  ps.associatedHeader = 'Language';
  ps.values = { 10: '10', 100: '100', 'PART DUEX': '1000' };
  component.personalSegments.push(ps);
  const result = componentProofList(component, []);
  expect(result).to.be.equal([{ TotalAmount: '10' }, { TotalAmount: '100' }, { TotalAmount: 'PART DUEX' }]);
});
