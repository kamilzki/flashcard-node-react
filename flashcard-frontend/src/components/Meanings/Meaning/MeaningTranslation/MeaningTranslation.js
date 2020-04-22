import React from 'react';
import './MeaningsTranslation.css'
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import {axiosServerAuthFunc} from "../../../../helpers/axiosInstance";

const MeaningTranslation = (props) => {

  const addFlashcard = (event) => {
    const body = {
      from: props.from,
      fromLang: props.fromLang,
      to: props.to,
      toLang: props.toLang,
      userId: localStorage.getItem('userId')
    };
    axiosServerAuthFunc().post('/flashcard', body)
      .then(result => {

      })
      .catch(err => {
      })
  };

  return <div className="meaningTranslation">
    <div>
      <IconButton
        onClick={addFlashcard}
        size="small"
        variant="contained"
        color="secondary">
        <AddIcon fontSize="inherit" />
      </IconButton>
    </div>
    <div className="card">
      <div className="content" dangerouslySetInnerHTML={{__html: props.meaning.source}}/>
      <div className="content" dangerouslySetInnerHTML={{__html: props.meaning.target}}/>
    </div>
  </div>;
};

export default MeaningTranslation;
