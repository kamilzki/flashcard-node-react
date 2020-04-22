import React from 'react';
import {useHistory} from "react-router-dom";
import {axiosServerAuth} from "../../helpers/axiosInstance";
import Meanings from "../Meanings/Meanings";

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
      axiosServerAuth.get(`/translation/${wordParam}?from=${fromParam}&to=${toParam}`, {})
        .then(result => {
          console.log('result.data');
          console.log(result.data);
          console.log(result.status);
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
              loaded: true
            }));
          }
          return result;
        })
        .catch(err => {
          let message = {message: 'Something go wrong. Please try again later.'};
          console.log(err.request);
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
    setLoading(state => ({
      ...state,
      loading: true
    }));
    fetchTranslations();
  }

  return <div>
    {
      loading.error ?
        <div>{loading.error.message}</div> :
        loading.loaded && results.meanings ?
          <div>
            {
              results.meanings.map((res, index) => (
                <Meanings
                  translations={res}
                  key={index}
                />
              ))
            }
          </div> :
          !results.meanings ?
            <div>Not found any translations</div> :
            <div>LOADING...</div>
    }
  </div>;
};

export default Translation;
