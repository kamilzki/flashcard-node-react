const express = require('express');
const { body } = require('express-validator/check');

const transaltionController = require('../controllers/translation');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get(
  '/:queryWord',
  isAuth,
  transaltionController.getTranslations
);

module.exports = router;
