import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import './Flashcards.css'

import {closeSnackbar, openSnackbar, removeFlashcard} from "../../redux/actions/rootAction";

import Flashcard from "./Flashcard/Flashcard";
import Alert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";
import {axiosServerAuthFunc} from "../../helpers/axiosInstance";
import {getErrorMessage, SUCCESSFULLY_DELETED} from "../../helpers/messageHelper";

const Flashcards = (props) => {
  const loading = useSelector((state) => state.flashcards.flashcardsLoading);
  const flashcards = useSelector((state) => state.flashcards.flashcards);
  const dispatch = useDispatch();

  const removeFlashcardHandler = (flashcardId) => {
    dispatch(closeSnackbar());
    axiosServerAuthFunc().delete('/flashcard/' + flashcardId)
      .then(_ => {
        dispatch(openSnackbar(SUCCESSFULLY_DELETED, "success"));
        dispatch(removeFlashcard(flashcardId));
      })
      .catch(err => {
        const message = getErrorMessage(err);
        dispatch(openSnackbar(message, "error"));
      })
  };

  return <div>
    {
      loading.error ?
        <Alert className="alertInfo" variant="filled" severity="error">
          {loading.error}
        </Alert> :
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
            <Alert className="alertInfo" variant="filled" severity="info">
              Not found any flashcards
            </Alert> :
            <LinearProgress/>
    }
  </div>;
};

export default Flashcards;
