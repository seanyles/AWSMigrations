require 'rails_helper'

RSpec.describe CreateProofSetJob, type: :job do
  include ActiveJob::TestHelper

  let(:user)      { create(:user) }
  let(:project)   { create(:marketplace_project) }
  let(:segment)   { project.segments.first }
  let(:component) { project.components.first }
  let!(:plan)     { create(:plan, :create_proof, planable: component, variables: vars) }

  context 'creating proof set file job' do
    let!(:mail_file) do
      create(:cleaned_mail_file,
             attachable: segment,
             segment: segment,
             document: Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/mail_files/mailfile_ai.csv')))
    end
    let(:personal_segment) { create(:personal_segment, segmentable: component, associated_header: 'tier') }
    let!(:creative_segment_1) do
      create(:creative_segment, segmentable: component, name: 'VIETNAMESE', associated_header: 'Language')
    end
    let!(:creative_segment_2) do
      create(:creative_segment, segmentable: component, name: 'CHINESE', associated_header: 'Language')
    end
    let!(:creative_segment_3) do
      create(:creative_segment, segmentable: component, name: 'English', associated_header: 'Language')
    end
    let(:vars) { %w(ID_LINK WINET_ID PROPID GSTID IGSTOFRNBR OFFERID GRPID LAST FIRST TITLE SUFFIX ADDTYPE ADDRESS1 ADDRESS2 APTNUM CITY ST ZIP COUNTRY TIER TIERSCORE TIER_ASOF ASSIGN MAILCODE MAILFLAG DOM_PROP PHONE BDAY SEEDS DISCOUNTIN JOB_NUM IMB_NUM IMBARCODE LANGUAGE) }

    before do
      personal_segment.update(values: { 'GLD' => 'GLD',
                                        'SEV' => 'SEV',
                                        'PLT' => 'PLT',
                                        'DIA' => 'DIA' })
    end

    it 'adds a record for each personal segment' do
      perform_enqueued_jobs { described_class.perform_later(segment) }
      rows = get_rows_from_proof_file(segment)
      binding.pry
      expect(rows.count).to be(49)
      expect(rows.map { |j| j['tier'] }.uniq).to match_array(%w(GLD SEV PLT DIA))
    end

    it 'adds a record for each creative segment' do
      perform_enqueued_jobs { described_class.perform_later(segment) }
      rows = get_rows_from_proof_file(segment)
      expect(rows.count).to be(49)
      expect(rows.map { |j| j['language'] }.uniq.compact).to match_array(%w(English CHINESE VIETNAMESE))
    end

    it 'adds a record for admin overrides' do
      component.update(indesign_layer_keys: ['tier'])
      perform_enqueued_jobs { described_class.perform_later(segment) }
      rows = get_rows_from_proof_file(segment)
      expect(rows.count).to be(49)
      expect(rows.map { |j| j['tier'] }.uniq.compact).to match_array(%w(GLD SEV PLT DIA))
    end

    it 'doesn\'t add duplicate records' do
      component.update(indesign_layer_keys: ['last'])
      perform_enqueued_jobs { described_class.perform_later(segment) }
      rows = get_rows_from_proof_file(segment)
      expect(rows.count).to be(49)
    end
  end

  context 'it finds the right number of rows in a real data set' do
    let!(:mail_file) do
      create(:cleaned_mail_file,
             attachable: segment,
             segment: segment,
             document: Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/data_files/6-27-2018.csv')))
    end
    let!(:personal_segment)   { create(:personal_segment, segmentable: component, associated_header: 'DOM_GAME') }
    let!(:creative_segment_1) do
      create(:creative_segment, segmentable: component, name: 'ZZ1', associated_header: 'RECGRP')
    end
    let!(:creative_segment_2) do
      create(:creative_segment, segmentable: component, name: 'ZZ2', associated_header: 'RECGRP')
    end
    let!(:creative_segment_3) do
      create(:creative_segment, segmentable: component, name: 'ZZ3', associated_header: 'RECGRP')
    end
    let!(:creative_segment_4) do
      create(:creative_segment, segmentable: component, name: 'ZZ4', associated_header: 'RECGRP')
    end
    let!(:creative_segment_5) do
      create(:creative_segment, segmentable: component, name: 'ZZ5', associated_header: 'RECGRP')
    end
    let!(:creative_segment_6) do
      create(:creative_segment, segmentable: component, name: 'ZZ6', associated_header: 'RECGRP')
    end
    let!(:creative_segment_7) do
      create(:creative_segment, segmentable: component, name: 'ZZ7', associated_header: 'RECGRP')
    end
    let!(:creative_segment_8) do
      create(:creative_segment, segmentable: component, name: 'ZZ8', associated_header: 'RECGRP')
    end
    let!(:creative_segment_9) do
      create(:creative_segment, segmentable: component, name: 'ZZ9', associated_header: 'RECGRP')
    end
    let!(:creative_segment_10) do
      create(:creative_segment, segmentable: component, name: 'ZZ10', associated_header: 'RECGRP')
    end
    let!(:creative_segment_11) do
      create(:creative_segment, segmentable: component, name: 'ZZ11', associated_header: 'RECGRP')
    end
    let!(:creative_segment_12) do
      create(:creative_segment, segmentable: component, name: 'ZZ12', associated_header: 'RECGRP')
    end
    let(:vars) { ['WINET_ID', 'OFFERID', 'RECGRP', 'FIRST', 'LAST', 'ADDRESS1', 'ADDRESS2', 'CITY', 'ST', 'ZIP', 'OFFER AMT 1', 'OFFER TYPE 1', 'OFFER 1 VALID', 'DOM_GAME', 'OFFER AMT 2', 'OFFER TYPE 2', 'OFFER 2 VALID'] }
    before do
      personal_segment.update!(values: { 'SLOT' => 'slot',
                                         'TABLE' => 'table' })
    end

    it 'doesn\'t add duplicate records' do
      perform_enqueued_jobs { described_class.perform_later(segment) }
      rows = get_rows_from_proof_file(segment)
      expect(rows.count).to be(45)
    end
  end

  context 'it finds the right number of rows in a real data set PART DUEX' do
    let!(:mail_file) do
      create(:cleaned_mail_file,
             attachable: segment,
             segment: segment,
             document: Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/data_files/14rec.csv')))
    end
    let!(:personal_segment) { create(:personal_segment, segmentable: component, associated_header: 'offer 1 type') }
    let!(:personal_segment2) { create(:personal_segment, segmentable: component, associated_header: 'offer 1 amt') }
    let!(:creative_segment_1) do
      create(:creative_segment, segmentable: component, name: '1H8VY', associated_header: 'OFFERID')
    end
    let!(:creative_segment_2) do
      create(:creative_segment, segmentable: component, name: '1H8VZ', associated_header: 'OFFERID')
    end
    let(:vars) do
      [
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
        'KEY1'
      ]
    end

    before do
      personal_segment.update(values: { 'Direct Bet' => '',
                                        'Free Slot Direct Bet Play' => '',
                                        'Free Slot Play' => '' })
      personal_segment2.update(values: { '40' => '',
                                         '60' => '',
                                         '80' => '' })
    end

    it 'adds the correct number of records' do
      perform_enqueued_jobs { described_class.perform_later(segment) }
      rows = get_rows_from_proof_file(segment)
      expect(rows.count).to be(21)
    end
  end

  context 'Shortest and longest row for each base_project required variable' do
    let!(:mail_file) do
      create(:cleaned_mail_file,
             attachable: segment,
             segment: segment,
             document: Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/data_files/8-01-2018.csv')))
    end
    let(:vars) { %w(LAST FIRST ADDRESS1 ADDRESS2 APTNUM CITY ST ZIP COUNTRY LANGUAGE) }

    it 'are exists' do
      component.plan = plan
      perform_enqueued_jobs { described_class.perform_later(segment) }
      rows = get_rows_from_proof_file(segment)

      addresses = rows.map { |row| row['address1'] }
      is_exists_shortest = addresses.include?('STAPLES')
      is_exists_longest = addresses.include?('3610 NEWBURY STREET')

      expect(is_exists_shortest).to be true
      expect(is_exists_longest).to be true
    end
  end

  def get_rows_from_proof_file(segment)
    file = segment.proof_set_files.last.download_document
    csv = CSV.read(file, headers: true)
    csv.map(&:to_h)
  end
end
