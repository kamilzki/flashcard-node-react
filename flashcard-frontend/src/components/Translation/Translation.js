import React from 'react';
import {useHistory} from "react-router-dom";
import {axiosServer} from "../../helpers/axiosInstance";
import Meanings from "../Meanings/Meanings";

const Translation = (props) => {
  const history = useHistory();
  const [results, setResults] = React.useState({
    fromWord: "",
    toWords: [],
    fromLang: "",
    toLang: ""
  });
  const [loading, setLoading] = React.useState({loading: false, loaded: false, error: false});

  const fetchTranslations = () => {
    const params = new URLSearchParams(history.location.search);
    const wordParam = params.get('word');
    if (wordParam) {
      console.log('wordParam found!', wordParam);
      // axiosServer.get(`/translation/?queryWord=${wordParam}`)
      axiosServer.get(`/translation/${wordParam}`)
        .then(result => {
          setResults(state => ({
            ...state,
            fromWord: 'fromWW',
            toWords: result.data
          }));
          setLoading(state => ({
            ...state,
            loading: false,
            loaded: true
          }));
          return result;
        })
        .catch(err => {
          console.log(err);
          setLoading(state => ({
            ...state,
            loading: false,
            loaded: false,
            error: true
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
    {loading.loaded ?
      <div>
        {results.toWords.map((res, index) => (
          <Meanings
            translations={res}
            key={index}
          />
        ))}
      </div> :
      <div>LOADING...</div>
    }
  </div>;
};

export default Translation;
