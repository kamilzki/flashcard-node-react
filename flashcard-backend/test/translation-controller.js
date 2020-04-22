const expect = require('chai').expect;
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');

const {axiosPons} = require('../helpers/axiosInstance');
const TranslationController = require('../controllers/translation');

describe('Feed Controller', function () {

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

    };
    const res = {
      statusCode: 500,
      body: null,
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.body = data
      }
    };

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
