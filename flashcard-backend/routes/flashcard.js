const express = require('express');
const { body } = require('express-validator/check');

const flashcardController = require('../controllers/flashcard');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/all', isAuth, flashcardController.getFlashcards);

router.post('',
  isAuth,
  [
    body('from')
      .trim()
      .notEmpty(),
    body('fromLang')
      .trim()
      .notEmpty(),
    body('to')
      .trim()
      .notEmpty(),
    body('toLang')
      .trim()
      .notEmpty()
  ],
  flashcardController.createFlashcard
);

router.get('/:flashcardId', isAuth, flashcardController.getFlashcard);

router.delete('/:flashcardId', isAuth, flashcardController.deleteFlashcard);

module.exports = router;
