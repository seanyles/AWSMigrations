const expect = require('chai').expect;
const fs = require('fs');
const parse = require('csv-parse');
const performJob = require('../src/create-proof-set-job');

describe('CreateProofSetJob', () => {
  let downloadDocument;
  let component;
  let component2;
  let project;
  let segment;
  let vars;
  let xmpie;

  beforeEach(() => {
    vars = [];
    xmpie = [];
    component = {
      variables: vars,
      creativeSegments: [],
      personalSegments: [],
      indesignLayerKeys: [],
    };
    component2 = {
      variables: [],
      creativeSegments: [],
      personalSegments: [],
      indesignLayerKeys: [],
    };
    project = {
      type: 'MarketplaceProject',
      xmpieRequiredFields: xmpie,
      sanitizedPlanVariables: vars,
      primaryKey: 'winet_id',
    };
    segment = {
      id: 1,
      components: [component, component2],
      baseProject: project,
    };
  });

  context('Creating Proof Set File Job', () => {
    beforeEach(() => {
      const personalSegment = {
        associatedHeader: 'tier',
        values: {
          GLD: 'GLD',
          SEV: 'SEV',
          PLT: 'PLT',
          DIA: 'DIA',
        },
      };
      const creativeSegment1 = {
        name: 'VIETNAMESE',
        associatedHeader: 'Language',
      };
      const creativeSegment2 = {
        name: 'CHINESE',
        associatedHeader: 'Language',
      };
      const creativeSegment3 = {
        name: 'English',
        associatedHeader: 'Language',
      };
      component.personalSegments.push(personalSegment);
      component.creativeSegments.push(...[creativeSegment1, creativeSegment2, creativeSegment3]);

      vars.push(...['ID_LINK', 'WINET_ID', 'PROPID', 'GSTID', 'IGSTOFRNBR', 'OFFERID', 'GRPID', 'LAST', 'FIRST', 'TITLE', 'SUFFIX', 'ADDTYPE', 'ADDRESS1', 'ADDRESS2', 'APTNUM', 'CITY', 'ST', 'ZIP', 'COUNTRY', 'TIER', 'TIERSCORE', 'TIER_ASOF', 'ASSIGN', 'MAILCODE', 'MAILFLAG', 'DOM_PROP', 'PHONE', 'BDAY', 'SEEDS', 'DISCOUNTIN', 'JOB_NUM', 'IMB_NUM', 'IMBARCODE', 'LANGUAGE']);
      xmpie.push(...['ID_LINK',
        'WINET_ID',
        'PROPID',
        'GSTID',
        'IGSTOFRNBR',
        'OFFERID',
        'GRPID',
        'LAST',
        'FIRST',
        'TITLE',
        'SUFFIX',
        'ADDTYPE',
        'ADDRESS1',
        'ADDRESS2',
        'APTNUM',
        'CITY',
        'ST',
        'ZIP',
        'COUNTRY',
        'TIER',
        'TIERSCORE',
        'TIER_ASOF',
        'ASSIGN',
        'MAILCODE',
        'MAILFLAG',
        'DOM_PROP',
        'PHONE',
        'BDAY',
        'SEEDS',
        'DISCOUNTIN',
        'JOB_NUM',
        'IMB_NUM',
        'IMBARCODE',
        'LANGUAGE',
        'Language',
        'tier',
        'ENDORSE',
        'PALLET_ID',
        'CONT_ID',
        'TRAYMARK_']);
      downloadDocument = fs.createReadStream('./test/testing-data/mailfile_ai.csv', 'utf8');
    });

    it('adds a record for each personal segment', async () => {
      await performJob(segment, downloadDocument);
      const rows = await getRows();
      expect(rows.length).to.be.equal(49);
      expect(rows.map(j => j.tier).uniqR()).to.have.members(['GLD', 'SEV', 'PLT', 'DIA']);
    });

    it('adds a record for each creative segment', async () => {
      await performJob(segment, downloadDocument);
      const rows = await getRows();
      expect(rows.length).to.be.equal(49);
      expect(rows.map(j => j.language).uniqR()).to.have.members(['English', 'CHINESE', 'VIETNAMESE']);
    });

    it('adds a record for admin overrides', async () => {
      component.indesignLayerKeys = ['tier'];
      await performJob(segment, downloadDocument);
      const rows = await getRows();
      expect(rows.length).to.be.equal(49);
      expect(rows.map(j => j.tier).uniqR()).to.have.members(['GLD', 'SEV', 'PLT', 'DIA']);
    });

    it('doesn\'t add duplicate records', async () => {
      component.indesignLayerKeys = ['last'];
      await performJob(segment, downloadDocument);
      const rows = await getRows();
      expect(rows.length).to.be.equal(49);
    });
  });

  context('it finds the right number of rows in a real data set', () => {
    beforeEach(() => {
      const personalSegment = {
        associatedHeader: 'DOM_GAME',
        values: {
          SLOT: 'slot',
          TABLE: 'table',
        },
      };
      const creativeSegment1 = {
        name: 'ZZ1',
        associatedHeader: 'RECGRP',
      };
      const creativeSegment2 = {
        name: 'ZZ2',
        associatedHeader: 'RECGRP',
      };
      const creativeSegment3 = {
        name: 'ZZ3',
        associatedHeader: 'RECGRP',
      };
      const creativeSegment4 = {
        name: 'ZZ4',
        associatedHeader: 'RECGRP',
      };
      const creativeSegment5 = {
        name: 'ZZ5',
        associatedHeader: 'RECGRP',
      };
      const creativeSegment6 = {
        name: 'ZZ6',
        associatedHeader: 'RECGRP',
      };
      const creativeSegment7 = {
        name: 'ZZ7',
        associatedHeader: 'RECGRP',
      };
      const creativeSegment8 = {
        name: 'ZZ8',
        associatedHeader: 'RECGRP',
      };
      const creativeSegment9 = {
        name: 'ZZ9',
        associatedHeader: 'RECGRP',
      };
      const creativeSegment10 = {
        name: 'ZZ10',
        associatedHeader: 'RECGRP',
      };
      const creativeSegment11 = {
        name: 'ZZ11',
        associatedHeader: 'RECGRP',
      };
      const creativeSegment12 = {
        name: 'ZZ12',
        associatedHeader: 'RECGRP',
      };
      component.personalSegments.push(personalSegment);
      component.creativeSegments.push(...[creativeSegment1, creativeSegment2, creativeSegment3,
        creativeSegment4, creativeSegment5, creativeSegment6,
        creativeSegment7, creativeSegment8, creativeSegment9,
        creativeSegment10, creativeSegment11, creativeSegment12]);

      vars.push(...['WINET_ID', 'OFFERID', 'RECGRP', 'FIRST', 'LAST', 'ADDRESS1', 'ADDRESS2', 'CITY', 'ST', 'ZIP', 'OFFER AMT 1', 'OFFER TYPE 1', 'OFFER 1 VALID', 'DOM_GAME', 'OFFER AMT 2', 'OFFER TYPE 2', 'OFFER 2 VALID']);
      xmpie.push(...['WINET_ID',
        'OFFERID',
        'RECGRP',
        'FIRST',
        'LAST',
        'ADDRESS1',
        'ADDRESS2',
        'CITY',
        'ST',
        'ZIP',
        'OFFER AMT 1',
        'OFFER TYPE 1',
        'OFFER 1 VALID',
        'DOM_GAME',
        'OFFER AMT 2',
        'OFFER TYPE 2',
        'OFFER 2 VALID',
        'IMBARCODE',
        'ENDORSE',
        'PALLET_ID',
        'CONT_ID',
        'TRAYMARK_']);

      downloadDocument = fs.createReadStream('./test/testing-data/6-27-2018.csv', 'utf8');
    });

    it('doesn\'t add duplicate records', async () => {
      await performJob(segment, downloadDocument);
      const rows = await getRows();
      expect(rows.length).to.be.equal(45);
    });
  });

  context('it finds the right number of rows in a real data set PART DUEX', () => {
    beforeEach(() => {
      const personalSegment1 = {
        associatedHeader: 'offer 1 type',
        values: {
          'Direct Bet': '',
          'Free Slot Direct Bet Play': '',
          'Free Slot Play': '',
        },
      };
      const personalSegment2 = {
        associatedHeader: 'offer 1 amt',
        values: {
          40: '',
          60: '',
          80: '',
        },
      };
      const creativeSegment1 = {
        name: '1H8VY',
        associatedHeader: 'OFFERID',
      };
      const creativeSegment2 = {
        name: '1H8VZ',
        associatedHeader: 'OFFERID',
      };
      component.personalSegments.push(...[personalSegment1, personalSegment2]);
      component.creativeSegments.push(...[creativeSegment1, creativeSegment2]);
      vars.push(...[
        'DP',
        'CUSTABRV',
        'NO_MAIL',
        'DUPE',
        'IMBARCODE',
        'IMB_ADR',
        'BRK',
        'PKG',
        'END',
        'COUNTRY',
        'ZIP',
        'ST',
        'CITY',
        'ADDRESS2',
        'ADDRESS1',
        'LAST',
        'MID',
        'FIRST',
        'FULLNAME',
        'ACCOUNT',
        'JOB_SEQ',
        'SEQ',
        'ID',
        'Dom_Game',
        '15',
        'call_to_action_2',
        'call_to_action_1',
        'Offer 3 Valid',
        'Offer 3 Type',
        'Offer 3 AMT',
        'Offer 2 Valid Period',
        'Offer 2 Type',
        'Offer 2 Amount',
        'Offer 1 Valid',
        'Offer 1 Type',
        'OFFER 1 AMT',
        'RG/GrpID',
        'OfferID',
        'I_DMID',
        'KEY1',
      ]);
      xmpie.push(...['DP',
        'CUSTABRV',
        'NO_MAIL',
        'DUPE',
        'IMBARCODE',
        'IMB_ADR',
        'BRK',
        'PKG',
        'END',
        'COUNTRY',
        'ZIP',
        'ST',
        'CITY',
        'ADDRESS2',
        'ADDRESS1',
        'LAST',
        'MID',
        'FIRST',
        'FULLNAME',
        'ACCOUNT',
        'JOB_SEQ',
        'SEQ',
        'ID',
        'DOM_GAME',
        '15',
        'CALL_TO_ACTION_2',
        'CALL_TO_ACTION_1',
        'OFFER 3 VALID',
        'OFFER 3 TYPE',
        'OFFER 3 AMT',
        'OFFER 2 VALID PERIOD',
        'OFFER 2 TYPE',
        'OFFER 2 AMOUNT',
        'OFFER 1 VALID',
        'OFFER 1 TYPE',
        'OFFER 1 AMT',
        'RG/GRPID',
        'OFFERID',
        'I_DMID',
        'KEY1',
        'offer 1 type',
        'offer 1 amt',
        'ENDORSE',
        'PALLET_ID',
        'CONT_ID',
        'TRAYMARK_']);

      downloadDocument = fs.createReadStream('./test/testing-data/14rec.csv', 'utf8');
    });

    it('adds the correct number of records', async () => {
      await performJob(segment, downloadDocument);
      const rows = await getRows();
      expect(rows.length).to.be.equal(21);
    });
  });

  context('Shortest and longest row for each baseProject required variable', () => {
    beforeEach(() => {
      vars.push(...['LAST', 'FIRST', 'ADDRESS1', 'ADDRESS2', 'APTNUM', 'CITY', 'ST', 'ZIP', 'COUNTRY', 'LANGUAGE']);
      xmpie.push(...['LAST', 'FIRST', 'ADDRESS1', 'ADDRESS2', 'APTNUM', 'CITY', 'ST', 'ZIP', 'COUNTRY', 'LANGUAGE', 'IMBARCODE', 'ENDORSE', 'PALLET_ID', 'CONT_ID', 'TRAYMARK_']);
      downloadDocument = fs.createReadStream('./test/testing-data/8-01-2018.csv', 'utf8');
    });

    it('exists', async () => {
      await performJob(segment, downloadDocument);
      const rows = await getRows();
      const addresses = rows.map(row => row.address1);
      expect(addresses).to.include('STAPLES');
      expect(addresses).to.include('3610 NEWBURY STREET');
    });
  });

  after(() => {
    fs.unlink('/tmp/proof-set-file.csv');
  });

  function getRows() {
    const parser = parse({ columns: true });
    const file = fs.createReadStream('/tmp/proof-set-file.csv', 'utf8');
    const rows = [];
    parser.on('readable', () => {
      const row = parser.read();
      if (row) { rows.push(row); }
    });
    file.pipe(parser);
    return new Promise((resolve, reject) => {
      parser.on('finish', () => {
        resolve(rows);
      });
      parser.on('error', err => reject(err));
    });
  }
});
