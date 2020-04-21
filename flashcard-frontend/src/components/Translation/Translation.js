import React from 'react';
import {useHistory} from "react-router-dom";
import {axiosServerAuth} from "../../helpers/axiosInstance";
import Meanings from "../Meanings/Meanings";

const Translation = (props) => {
  const history = useHistory();
  const [results, setResults] = React.useState({
    fromWord: "",
    meanings: [],
    fromLang: "",
    toLang: ""
  });
  const [loading, setLoading] = React.useState({loading: false, loaded: false, error: false});

  const fetchTranslations = () => {
    const params = new URLSearchParams(history.location.search);
    const wordParam = params.get('word');
    const fromParam = params.get('from');
    const toParam = params.get('to');

    if (wordParam && fromParam && toParam) {
      axiosServerAuth.get(`/translation/${wordParam}?from=${fromParam}&to=${toParam}`, {})
        .then(result => {
          setResults(state => ({
            ...state,
            fromWord: wordParam,
            meanings: result.data
          }));
          setLoading(state => ({
            ...state,
            loading: false,
            loaded: true
          }));
          return result;
        })
        .catch(err => {
          let message = JSON.parse(err.request.response);

          setLoading(state => ({
            ...state,
            loading: false,
            loaded: false,
            error: message
          }));
        })
    }
  };

  if (!loading.loading && !loading.error && !loading.loaded) {
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
        loading.loaded ?
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
          <div>LOADING...</div>
    }
  </div>;
};

export default Translation;
