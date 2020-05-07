const expect = require('chai').expect;
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');

const {getResMock} = require('./testHelper');
const {axiosPons} = require('../helpers/axiosInstance');
const TranslationController = require('../controllers/translation');

describe('Translation Controller', function () {

  describe('getTranslation', function () {

    after(function () {
      axiosPons.get.restore();
    });

    it('should failed on invalid language code', function (done) {

      const req = {
        params: {
          queryWord: 'samochód'
        },
        query: {
          from: TranslationController.languages.Polish,
          to: 'bad code'
        }
      };
      const res = getResMock();

      TranslationController.getTranslations(req, res, () => {
      }).then(() => {
        console.log(JSON.stringify(res.body));
        expect(res).to.not.be.undefined;
        expect(res.statusCode).to.be.equal(404);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.eq;
        expect(res.body).have.property('message').eql('Bad language code.');
        done();
      });
    });

    it('should successfully prepare data from PONS response', function (done) {
      const filePath = path.join('test', 'resources', 'translationCorrectResponse.json');
      const response = fs.readFileSync(filePath);

      sinon.stub(axiosPons, 'get');
      axiosPons.get.returns(
        {data: JSON.parse(response)}
      );

      const req = {
        params: {
          queryWord: 'samochód'
        },
        query: {
          from: TranslationController.languages.Polish,
          to: TranslationController.languages.German
        }
      };
      const res = getResMock();

      TranslationController.getTranslations(req, res, () => {
      }).then(() => {
        console.log(JSON.stringify(res.body));
        expect(res).to.not.be.undefined;
        expect(res.statusCode).to.be.equal(200);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.have.length(2);
        expect(res.body[0]).to.have.length(2);
        expect(res.body[0][0]).to.have.property('header');
        expect(res.body[0][0]).to.have.property('translations');
        expect(res.body[0][0].translations).to.have.length(3);
        expect(res.body[0][1].header).to.have.equal('Phrases:');
        done();
      });
    });
  });

  describe('getSuggestionss', function () {

    after(function () {
      axiosPons.get.restore();
    });

    it('should failed on invalid language code', function (done) {

      const req = {
        params: {
          queryWord: 'samochód'
        },
        query: {
          from: TranslationController.languages.Polish,
          to: 'bad code'
        }
      };
      const res = getResMock();

      TranslationController.getSuggestions(req, res, () => {
      }).then(() => {
        console.log(JSON.stringify(res.body));
        expect(res).to.not.be.undefined;
        expect(res.statusCode).to.be.equal(404);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.eq;
        expect(res.body).have.property('message').eql('Bad language code.');
        done();
      });
    });

    it('should successfully response with suggestions', function (done) {
      const filePath = path.join('test', 'resources', 'suggestionCorrectResponse.json');
      const response = fs.readFileSync(filePath);

      sinon.stub(axiosPons, 'get');
      axiosPons.get.returns(
        {data: JSON.parse(response)}
      );

      const req = {
        params: {
          queryWord: 'auto'
        },
        query: {
          from: TranslationController.languages.Polish,
          to: TranslationController.languages.German
        }
      };
      const res = getResMock();

      TranslationController.getSuggestions(req, res, () => {
      }).then(() => {
        console.log('after test: ' + JSON.stringify(res.body));
        expect(res).to.not.be.undefined;
        expect(res.statusCode).to.be.equal(200);
        expect(res.body).to.have.length(12);

        const expectedFilePath = path.join('test', 'resources', 'expectedSuggestionCorrectResponse.json');
        const expectedResponse = JSON.parse(fs.readFileSync(expectedFilePath));
        expect(expectedResponse).to.eql(res.body);
        done();
      });
    });
  })
});
