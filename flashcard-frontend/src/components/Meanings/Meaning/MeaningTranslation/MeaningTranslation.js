import React from 'react';
import {useDispatch} from "react-redux";
import './MeaningsTranslation.css'

import {axiosServerAuthFunc} from "../../../../helpers/axiosInstance";
import {addFlashcard, removeFlashcard} from "../../../../redux/actions/rootAction";

import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const MeaningTranslation = (props) => {
  const dispatch = useDispatch();

  const addFlashcardHandler = (event) => {
    const body = {
      from: props.from,
      fromLang: props.fromLang,
      to: props.to,
      toLang: props.toLang,
      userId: localStorage.getItem('userId')
    };
    axiosServerAuthFunc().post('/flashcard', body)
      .then(result => {
        dispatch(addFlashcard(result.data.flashcard))
      })
      .catch(err => {
      })
  };

  const removeFlashcardHandler = (event) => {
    axiosServerAuthFunc().delete('/flashcard/' + props.flashcard._id)
      .then(_ => {
        dispatch(removeFlashcard(props.flashcard._id));
      })
      .catch(err => {
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
