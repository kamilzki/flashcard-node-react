import React from 'react';
import {axiosServerAuthFunc} from "../../helpers/axiosInstance";
import RemoveIcon from '@material-ui/icons/Remove';
import Flashcard from "./Flashcard/Flashcard";

const Flashcards = (props) => {
  const [flashcards, setFlashcards] = React.useState(null);
  const [loading, setLoading] = React.useState({loading: false, loaded: false, error: false});

  const fetchFlashcards = () => {
    axiosServerAuthFunc().get(`/flashcard/all`)
      .then(result => {
        if (result.status === 200 || result.status === 204) {
          setFlashcards(state => (result.data.flashcards));
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
        if (err.request && err.request.response) {
          message = JSON.parse(err.request.response);
        }

        setLoading(state => ({
          ...state,
          loading: false,
          loaded: false,
          error: message
        }));
        setFlashcards(state => ([]));
      })
  };

  const removeFlashcardHandler = (flashcardId) => {
    axiosServerAuthFunc().delete('/flashcard/' + flashcardId)
      .then(_ => {
        const withoutDeleted = flashcards.filter(it => it._id !== flashcardId);
        setFlashcards(state => (withoutDeleted));
      })
      .catch(err => {

      })
  };

  let gotResponseFromServer = !loading.error && !loading.loaded;
  if (!loading.loading && gotResponseFromServer) {
    setLoading(state => ({
      ...state,
      loading: true
    }));
    fetchFlashcards();
  }

  return <div>
    {
      loading.error ?
        <div>{loading.error.message}</div> :
        loading.loaded && flashcards && flashcards.length > 0 ?
          <div className="flashcards">
            {
              flashcards.map(it => (
                <Flashcard
                  flashcard={it}
                  removeFlashcard={removeFlashcardHandler}
                  key={it._id}
                />
              ))
            }
          </div> :
          loading.loaded ?
            <div>Not found any flashcards</div> :
            <div>LOADING...</div>
    }
  </div>;
};

export default Flashcards;
