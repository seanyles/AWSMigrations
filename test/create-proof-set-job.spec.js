const expect = require('chai').expect;
const fs = require('fs');
const parse = require('csv-parse');
const performJob = require('../src/create-proof-set-job');

describe('CreateProofSetJob', () => {
  let vars = [];
  let xmpie = [];
  let downloadDocument;

  const component = {
    variables: vars,
    creativeSegments: [],
    personalSegments: [],
    indesignLayerKeys: [],
  };
  const project = {
    type: 'MarketplaceProject',
    xmpieRequiredFields: xmpie,
    sanitizedPlanVariables: vars,
    primaryKey: 'winet_id',
  };
  const segment = {
    id: 1,
    components: [component],
    baseProject: project,
  };

  context('Creating Proof Set File Job', () => {
    before(() => {
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
    });

    beforeEach(() => {
      downloadDocument = fs.createReadStream('./test/testing-data/mailfile_ai.csv', 'utf8');
    });

    after(() => {
      component.creativeSegments = [];
      component.personalSegments = [];
      component.indesignLayerkeys = [];
      vars = [];
      xmpie = [];
    });

    it('adds a record for each personal segment', async () => {
      await performJob(segment, downloadDocument);
      const rows = await getRows();
      expect(rows.length).to.be.equal(49);
      expect(rows.map(j => j.tier).uniq()).to.have.members(['GLD', 'SEV', 'PLT', 'DIA']);
    });

    it('adds a record for each creative segment', async () => {
      await performJob(segment, downloadDocument);
      const rows = await getRows();
      expect(rows.length).to.be.equal(49);
      expect(rows.map(j => j.language).uniq()).to.have.members(['English', 'CHINESE', 'VIETNAMESE']);
    });

    it('adds a record for admin overrides', async () => {
      component.indesignLayerKeys = ['tier'];
      await performJob(segment, downloadDocument);
      const rows = await getRows();
      expect(rows.length).to.be.equal(49);
      expect(rows.map(j => j.tier).uniq()).to.have.members(['GLD', 'SEV', 'PLT', 'DIA']);
    });

    it('doesn\'t add duplicate records', async () => {
      component.indesignLayerKeys = ['last'];
      await performJob(segment, downloadDocument);
      const rows = await getRows();
      expect(rows.length).to.be.equal(49);
    });
  });

  context('it finds the right number of rows in a real data set', () => {
    before(() => {
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
      component.personalSegments.push(...[creativeSegment1, creativeSegment2, creativeSegment3,
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
    });

    beforeEach(() => {
      downloadDocument = fs.createReadStream('./test/testing-data/6-27-2018.csv', 'utf8');
    });

    after(() => {
      component.creativeSegments = [];
      component.personalSegments = [];
      component.indesignLayerkeys = [];
      vars = [];
    });

    it('doesn\'t add duplicate records', async () => {
      await performJob(segment, downloadDocument);
      const rows = await getRows();
      expect(rows.length).to.be.equal(45);
    });
  });

  function getRows() {
    const parser = parse({ columns: true });
    const file = fs.createReadStream('./tmp/proof_set_file.csv', 'utf8');
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
