import React from 'react';
import {useDispatch} from "react-redux";
import './MeaningsTranslation.css'

import {axiosServerAuthFunc} from "../../../../helpers/axiosInstance";
import {getErrorMessage, SUCCESSFULLY_ADDED, SUCCESSFULLY_DELETED} from "../../../../helpers/messageHelper";
import {addFlashcard, closeSnackbar, openSnackbar, removeFlashcard} from "../../../../redux/actions/rootAction";

import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const MeaningTranslation = (props) => {
  const dispatch = useDispatch();

  const addFlashcardHandler = (event) => {
    dispatch(closeSnackbar());
    const body = {
      from: props.from,
      fromLang: props.fromLang,
      to: props.to,
      toLang: props.toLang,
      userId: localStorage.getItem('userId')
    };
    axiosServerAuthFunc().post('/flashcard', body)
      .then(result => {
        dispatch(openSnackbar(SUCCESSFULLY_ADDED, "success"));
        dispatch(addFlashcard(result.data.flashcard))
      })
      .catch(err => {
        dispatch(openSnackbar(getErrorMessage(err), "error"));
      })
  };

  const removeFlashcardHandler = (event) => {
    dispatch(closeSnackbar());
    axiosServerAuthFunc().delete('/flashcard/' + props.flashcard._id)
      .then(_ => {
        dispatch(openSnackbar(SUCCESSFULLY_DELETED, "success"));
        dispatch(removeFlashcard(props.flashcard._id));
      })
      .catch(err => {
        const message = getErrorMessage(err);
        dispatch(openSnackbar(message, "error"));
        if (message === "Could not find.") {
          dispatch(removeFlashcard(props.flashcard._id));
        }
      })
  };

  return <div className="meaningTranslation">
    <div>
      {
        props.flashcard ?
          <IconButton
            onClick={removeFlashcardHandler}
            size="small"
            variant="contained"
            color="secondary">
            <RemoveIcon fontSize="inherit" />
          </IconButton> :
          <IconButton
            onClick={addFlashcardHandler}
            size="small"
            variant="contained"
            color="secondary">
            <AddIcon fontSize="inherit" />
          </IconButton>
      }
    </div>
    <div className="card">
      <div className="content" dangerouslySetInnerHTML={{__html: props.meaning.source}}/>
      <div className="content" dangerouslySetInnerHTML={{__html: props.meaning.target}}/>
    </div>
  </div>;
};

export default MeaningTranslation;
