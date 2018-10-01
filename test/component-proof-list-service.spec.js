const expect = require('chai').expect;
const beforeEach = require('mocha').beforeEach;
const rewire = require('rewire');

const componentProofList = rewire('../src/component-proof-list-service');
const personalSegmentUniqueVals = componentProofList.__get__('personalSegmentUniqueVals');
const creativeSegmentUniqueVals = componentProofList.__get__('creativeSegmentUniqueVals');
const indesignUniqueVals = componentProofList.__get__('indesignUniqueVals');
const uniqueValueCombination = componentProofList.__get__('uniqueValueCombination');

let component;
let data;

describe.only('Component Proof List Service', () => {
  beforeEach(() => {
    component = {
      variables: [],
      creativeSegments: [],
      personalSegments: [],
      indesignLayerKeys: [],
    };
    data = [];

    componentProofList.__set__('component', component);
    componentProofList.__set__('allRows', data);
  });

  it('returns the right array for personal segments', () => {
    const ps = {};
    ps.associatedHeader = 'TotalAmount';
    ps.values = { 10: '10', 100: '100', 'PART DUEX': '1000' };
    component.personalSegments.push(ps);
    const result = personalSegmentUniqueVals();
    expect(result).to.be.eql([{ TotalAmount: '10' }, { TotalAmount: '100' }, { TotalAmount: 'PART DUEX' }]);
  });

  it('returns the right array for creative segments', () => {
    const cs = [{ associatedHeader: 'Language', name: 'English' },
      { associatedHeader: 'Language', name: 'Chinese' },
      { associatedHeader: 'Language', name: 'Vietnamese' }];
    component.creativeSegments.push(...cs);
    const result = creativeSegmentUniqueVals();
    expect(result).to.be.eql([{ Language: 'English' }, { Language: 'Chinese' }, { Language: 'Vietnamese' }]);
  });

  it('gets the right values for indesign layers inputted by the admin', () => {
    component.indesignLayerKeys.push('PART DUEX');
    data.push(...[{ 'PART DUEX': 'This is really not' }, { 'PART DUEX': 'A helpful error message' }]);
    const result = indesignUniqueVals();
    expect(result).to.be.eql([{ 'PART DUEX': 'This is really not' }, { 'PART DUEX': 'A helpful error message' }]);
  });

  it('builds the expected set correctly when everything present', () => {
    component.creativeSegments.push({ associatedHeader: 'Language', name: 'English' });
    component.personalSegments.push({ associatedHeader: 'TotalAmount', values: { 10: '10', 100: '100' } });
    component.indesignLayerKeys.push('PART DUEX');
    data.push(...[{ 'PART DUEX': 'This is really not' }, { 'PART DUEX': 'A helpful error message' }]);
    const result = uniqueValueCombination();
    expect(result).to.be.eql([[{ Language: 'English' }, { TotalAmount: '10' }, { 'PART DUEX': 'This is really not' }],
      [{ Language: 'English' }, { TotalAmount: '10' }, { 'PART DUEX': 'A helpful error message' }],
      [{ Language: 'English' }, { TotalAmount: '100' }, { 'PART DUEX': 'This is really not' }],
      [{ Language: 'English' }, { TotalAmount: '100' }, { 'PART DUEX': 'A helpful error message' }]]);
  });

  it('builds the expected set correctly when everything present with multiple CTAs', () => {
    component.creativeSegments.push({ associatedHeader: 'Language', name: 'English' });
    component.personalSegments.push({ associatedHeader: 'TotalAmount', values: { 10: '10', 100: '100' } });
    component.personalSegments.push({ associatedHeader: 'Dom_Game', values: { Slot: 's_val', Table: 't_val' } });
    component.indesignLayerKeys.push('PART DUEX');
    data.push(...[{ 'PART DUEX': 'This is really not' }, { 'PART DUEX': 'A helpful error message' }]);
    const result = uniqueValueCombination();
    expect(result).to.have.deep.members([[{ Language: 'English' }, { TotalAmount: '10' }, { Dom_Game: 'Slot' }, { 'PART DUEX': 'This is really not' }],
      [{ Language: 'English' }, { TotalAmount: '10' }, { Dom_Game: 'Slot' }, { 'PART DUEX': 'A helpful error message' }],
      [{ Language: 'English' }, { TotalAmount: '100' }, { Dom_Game: 'Slot' }, { 'PART DUEX': 'This is really not' }],
      [{ Language: 'English' }, { TotalAmount: '100' }, { Dom_Game: 'Slot' }, { 'PART DUEX': 'A helpful error message' }],
      [{ Language: 'English' }, { TotalAmount: '10' }, { Dom_Game: 'Table' }, { 'PART DUEX': 'This is really not' }],
      [{ Language: 'English' }, { TotalAmount: '10' }, { Dom_Game: 'Table' }, { 'PART DUEX': 'A helpful error message' }],
      [{ Language: 'English' }, { TotalAmount: '100' }, { Dom_Game: 'Table' }, { 'PART DUEX': 'This is really not' }],
      [{ Language: 'English' }, { TotalAmount: '100' }, { Dom_Game: 'Table' }, { 'PART DUEX': 'A helpful error message' }]]);
  });

  it('builds the expected set correctly when just indesign is present', () => {
    component.creativeSegments.push({ associatedHeader: 'Language', name: 'English' });
    component.indesignLayerKeys.push('PART DUEX');
    data.push(...[{ 'PART DUEX': 'This is really not' }, { 'PART DUEX': 'A helpful error message' }]);
    const result = uniqueValueCombination();
    expect(result).to.be.eql([[{ Language: 'English' }, { 'PART DUEX': 'This is really not' }],
      [{ Language: 'English' }, { 'PART DUEX': 'A helpful error message' }]]);
  });

  it('builds the expected set correctly when just personal is present', () => {
    component.creativeSegments.push({ associatedHeader: 'Language', name: 'English' });
    component.personalSegments.push({ associatedHeader: 'TotalAmount', values: { 10: '10', 100: '100' } });
    data.push(...[{ 'PART DUEX': 'This is really not' }, { 'PART DUEX': 'A helpful error message' }]);
    const result = uniqueValueCombination();
    expect(result).to.be.eql([[{ Language: 'English' }, { TotalAmount: '10' }],
      [{ Language: 'English' }, { TotalAmount: '100' }]]);
  });

  it('builds the expected set correctly when just creative is present', () => {
    component.creativeSegments.push({ associatedHeader: 'Language', name: 'English' });
    data.push(...[{ 'PART DUEX': 'This is really not' }, { 'PART DUEX': 'A helpful error message' }]);
    const result = uniqueValueCombination();
    expect(result).to.be.eql([[{ Language: 'English' }]]);
  });

  describe('#checkUniqueValues', () => {
    const duplicated = { first: 'Name', last: 'Name' };
    const notDuplicated = { first: 'FIRST', last: 'LAST' };
    component = {
      variables: ['FIRST', 'LAST'],
      creativeSegments: [{ associatedHeader: 'first', name: 'Name' }, { associatedHeader: 'first', name: 'FIRST' }],
      personalSegments: [],
      indesignLayerKeys: [],
    };
    data = [duplicated, notDuplicated];
    const subject = componentProofList(component, data);

    it('is not duplicated', () => {
      expect(subject).to.be.eql([notDuplicated]);
      expect(subject).to.not.include(duplicated);
    });
  });
});
