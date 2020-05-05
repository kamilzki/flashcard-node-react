import React from 'react';
import {useHistory} from "react-router-dom";
import {axiosServerAuthFunc} from "../../helpers/axiosInstance";
import Meanings from "../Meanings/Meanings";
import Alert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";

const Translation = (props) => {
  const history = useHistory();
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
        loading: true
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
          let message = {message: 'Something go wrong. Please try again later.'};
          if (err.request.response) {
            message = JSON.parse(err.request.response);
          }

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

  return <div>
    {
      loading.error ?
        <Alert className="alertInfo" variant="filled" severity="error">
          {loading.error.message}
        </Alert> :
        loading.loaded && results.meanings ?
          <div>
            {
              results.meanings.map((res, index) => (
                <Meanings
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
            <LinearProgress />
    }
  </div>;
};

export default Translation;
