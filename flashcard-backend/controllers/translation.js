const {validationResult} = require('express-validator/check');
const {axiosPons} = require('../helpers/axiosInstance');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const languages = {
  Polish: 'pl',
  English: 'en',
  French: 'fr',
  German: 'de',
  Italian: 'it',
  Russian: 'ru',
  Spanish: 'es'
};
exports.languages = languages;

const languageCodes = Object.values(languages);

const isValidLanguageCode = (code) => {
  return languageCodes.indexOf(code) > -1
};

const getExampleData = () => {
  const filePath = path.join('test', 'resources', 'translationCorrectResponse.json');
  const response = fs.readFileSync(filePath);
  return {data: JSON.parse(response)};
};

exports.getTranslations = async (req, res, next) => {
  try {
    const queryWord = req.params.queryWord;
    const from = req.query.from;
    const to = req.query.to;

    if (!isValidLanguageCode(from) || !isValidLanguageCode(to)) {
      return res.status(404).json({message: 'Bad language code.'});
    }

    const languageCode = to + from;
    // const queryResult = getExampleData();
    const queryResult = await axiosPons.get('/dictionary?' + querystring.stringify({l: languageCode, q: queryWord}));
    if (queryResult.status === 204) {
      return res.status(204).json({message: queryResult.statusText});
    }
    const resultBody = queryResult.data.flatMap(it => {
      return it.hits.map(hit => {
        if (hit.type === 'entry')
          return hit.roms.flatMap(rom => {
            return rom.arabs.map(arab => ({header: arab.header, translations: arab.translations}));
          });
        else if (hit.type === 'translation')
          return [{header: hit.type, translations: [{source: hit.source, target: hit.target}]}];
        else
          return null;
      }).filter(hitResult => hitResult)
    });

    console.log(resultBody);
    res.status(200).json(resultBody);
  } catch (err) {
    if (!err.response || !err.response.status) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.getSuggestions = async (req, res, next) => {
  try {
    const queryWord = req.params.queryWord;
    const from = req.query.from;
    const to = req.query.to;

    if (!isValidLanguageCode(from) || !isValidLanguageCode(to)) {
      return res.status(404).json({message: 'Bad language code.'});
    }

    const languageCode = to + from;

    const queryResult = await axios.get("https://pons.com/dict/search/autocomplete-json/?" + querystring.stringify({l: languageCode, q: queryWord}));
    if (queryResult.status === 204) {
      return res.status(204).json({message: queryResult.statusText});
    }
    const resultBody = queryResult.data.flatMap(it => {
      console.log(it);
      return it
    });

    console.log(resultBody);
    res.status(200).json(resultBody);
  } catch (err) {
    if (!err.response || !err.response.status) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.getLanguages = async (req, res, next) => {
  res.status(200).json(languages)
};