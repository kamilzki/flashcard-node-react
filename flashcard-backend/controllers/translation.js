const {validationResult} = require('express-validator/check');
const {axiosPons} = require('../helpers/axiosInstance');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

const getExampleData = () => {
  const filePath = path.join('test', 'resources', 'translationCorrectResponse.json');
  const response = fs.readFileSync(filePath);
  return {data: JSON.parse(response)};
};

exports.getTranslations = async (req, res, next) => {
  try {
    const queryWord = req.params.queryWord;

    const queryResult = getExampleData();
    // const queryResult = await axiosPons.get('/dictionary?' + querystring.stringify({ l: 'depl', q: queryWord }));

    const resultBody = queryResult.data.flatMap(it => {
      return it.hits.map(hit => {
        return hit.roms.flatMap(rom => {
          return rom.arabs.map(arab => ({header: arab.header, translations: arab.translations}));
        });
      })
    });

    console.log(resultBody);
    res.status(200).json(resultBody);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};