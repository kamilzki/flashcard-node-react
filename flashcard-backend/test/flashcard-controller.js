const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
require('dotenv').config();

const {getResMock} = require("./testHelper");
const User = require('../models/user');
const Flashcard = require('../models/flashcard');
const FlashcardController = require('../controllers/flashcard');

describe('Flashcard Controller', function () {
  const userId = '5c0f66b979af55031b34728a';

  before(function (done) {
    mongoose.connect(process.env.TEST_MONGODB)
      .then(_ => {
        return User.deleteMany({})
      })
      .then(_ => {
        return Flashcard.deleteMany({})
      })
      .then(() => {
        const user = new User({
          email: 'test@test.com',
          password: 'testest',
          name: 'Test',
          flashcards: [],
          _id: userId
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  it('should create flashcard for user', function (done) {
    let body = {
      from: 'zamek',
      fromLang: 'pl',
      to: 'Wagen',
      toLang: 'de'
    };
    const req = {
      body: body,
      userId: userId
    };
    const res = getResMock();

    FlashcardController.createFlashcard(req, res, () => {
    }).then(result => {
      expect(res.statusCode).to.be.equal(201);
      expect(res.body).to.have.property('message').eql('Flashcard created successfully!');
      expect(res.body).to.have.property('flashcard');
      expect(res.body.flashcard).to.have.property('from').eql(body.from);
      expect(res.body.flashcard).to.have.property('fromLang').eql(body.fromLang);
      expect(res.body.flashcard).to.have.property('to').eql([body.to]);
      expect(res.body.flashcard).to.have.property('toLang').eql(body.toLang);
      expect(res.body.flashcard).to.have.property('creator');
      expect(res.body.flashcard.creator).to.have.property('id');
      expect(res.body.flashcard.creator._id.toString()).equal(userId);

      done();
    });
  });

  it('should get all flashcards for user', function (done) {
    const req = {
      userId: userId
    };
    const res = getResMock();

    FlashcardController.getFlashcards(req, res, () => {
    }).then(result => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.body).to.have.property('totalItems').eql(1);
      expect(res.body).to.have.property('flashcards').length(1);
      done();
    });
  });

  it('should successfully delete flashcard for user', function (done) {
    Flashcard.findOne({creator: userId})
      .then(result => {
        const flashcardId = result.toObject()._id.toString();
        const req = {
          userId: userId,
          params: {
            flashcardId: flashcardId
          }
        };
        const res = getResMock();

        FlashcardController.deleteFlashcard(req, res, () => {
        }).then(resultUser => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body).to.have.property('message', 'Deleted flashcard.');
          expect(resultUser.flashcards).to.have.length(0);
          done();
        });
      });
  });

  it('should not found flashcard and response with 404', function (done) {
    const badFlashcardId = 'badF66b979af11111b11111a';
    const req = {
      userId: userId,
      params: {
        flashcardId: badFlashcardId
      }
    };
    const res = getResMock();

    FlashcardController.deleteFlashcard(req, res, () => {
    }).then(result => {
      expect(res.statusCode).to.be.equal(404);
      expect(res.body).to.have.property('message', 'Could not find.');
      done();
    });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
