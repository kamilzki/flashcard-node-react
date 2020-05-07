import React from 'react';
import {useHistory} from "react-router-dom";
import {axiosServerAuthFunc} from "../../helpers/axiosInstance";
import Meanings from "../Meanings/Meanings";
import Alert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";
import {useSelector} from "react-redux";
import {getErrorMessage} from "../../helpers/messageHelper";

const Translation = (props) => {
  const history = useHistory();
  const flashcards = useSelector((state) => state.flashcards.flashcards);

  const [results, setResults] = React.useState({
    fromWord: "",
    meanings: null,
    fromLang: "",
    toLang: ""
  });
  const [loading, setLoading] = React.useState({loading: false, loaded: false, error: false});

  const urlSearchParams = new URLSearchParams(history.location.search);
  const wordParam = urlSearchParams.get('word');
  const fromParam = urlSearchParams.get('from');
  const toParam = urlSearchParams.get('to');

  const fetchTranslations = () => {
    if (wordParam && fromParam && toParam) {
      setLoading(state => ({
        ...state,
        loading: true,
        error: false
      }));

      axiosServerAuthFunc().get(`/translation/${wordParam}?from=${fromParam}&to=${toParam}`, {})
        .then(result => {
          if (result.status === 200 || result.status === 204) {
            setResults(state => ({
              ...state,
              fromWord: wordParam,
              meanings: result.data,
              fromLang: fromParam,
              toLang: toParam
            }));
            setLoading(state => ({
              ...state,
              loading: false,
              loaded: true,
              error: false
            }));
          }
          return result;
        })
        .catch(err => {
          const message = getErrorMessage(err);
          setLoading(state => ({
            ...state,
            loading: false,
            loaded: false,
            error: message
          }));
          setResults(state => ({
            ...state,
            fromWord: wordParam,
            fromLang: fromParam,
            toLang: toParam
          }));
        })
    }
  };

  let gotResponseFromServer = !loading.error && !loading.loaded;
  let changedQueryParams = results.fromWord !== wordParam || results.fromLang !== fromParam || results.toLang !== toParam;
  if (!loading.loading && (gotResponseFromServer || changedQueryParams)) {
    fetchTranslations();
  }

  const getFlashcard = (from, to, fromLang, toLang) => {
    return flashcards.find(flashcard => flashcard.from === from &&
      flashcard.to[0] === to &&
      flashcard.fromLang === fromLang &&
      flashcard.toLang === toLang
    );
  };

  return <div>
    {
      loading.error ?
        <Alert className="alertInfo" variant="filled" severity="error">
          {loading.error}
        </Alert> :
        loading.loaded && results.meanings ?
          <div>
            {
              results.meanings.map((res, index) => (
                <Meanings
                  getFlashcard={getFlashcard}
                  translations={res}
                  fromLang={results.fromLang}
                  toLang={results.toLang}
                  key={index}
                />
              ))
            }
          </div> :
          !loading.loading ?
            <Alert className="alertInfo" variant="filled" severity="info">
              Not found any translations
            </Alert> :
            <LinearProgress/>
    }
  </div>;
};

export default Translation;
