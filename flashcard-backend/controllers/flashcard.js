const {validationResult} = require('express-validator/check');

const Flashcard = require('../models/flashcard');
const User = require('../models/user');

exports.getFlashcards = async (req, res, next) => {
  try {
    const totalItems = await Flashcard.find().countDocuments();
    const flashcards = await Flashcard.find({'creator': req.userId});

    res.status(200).json({
      flashcards: flashcards,
      totalItems: totalItems
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createFlashcard = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const from = req.body.from;
  const fromLang = req.body.fromLang;
  const to = req.body.to;
  const toLang = req.body.toLang;
  const flashcard = new Flashcard({
    from: from,
    fromLang: fromLang,
    to: to,
    toLang: toLang,
    creator: req.userId
  });
  try {
    await flashcard.save();

    const user = await User.findById(req.userId);
    user.flashcards.push(flashcard);
    await user.save();

    res.status(201).json({
      message: 'Flashcard created successfully!',
      flashcard: flashcard,
      creator: {_id: user._id, name: user.name}
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getFlashcard = async (req, res, next) => {
  const id = req.params.flashcardId;

  try {
    const flashcard = await Flashcard.find({_id: id, creator: req.userId});
    if (!flashcard) {
      const error = new Error('Could not find flashcard.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({flashcard: flashcard});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteFlashcard = async (req, res, next) => {
  const id = req.params.flashcardId;
  try {
    const flashcard = await Flashcard.find({_id: id, creator: req.userId});

    if (!flashcard) {
      const error = new Error('Could not find.');
      error.statusCode = 404;
      throw error;
    }

    await Flashcard.findByIdAndRemove(id);

    const user = await User.findById(req.userId);
    user.flashcards.pull(id);
    await user.save();

    res.status(200).json({message: 'Deleted flashcard.'});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};