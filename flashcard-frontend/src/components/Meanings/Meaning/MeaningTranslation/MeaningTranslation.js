import React from 'react';
import './MeaningsTranslation.css'
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';

const MeaningTranslation = (props) => {

  return <div className="meaningTranslation">
    <div>
      <IconButton
        onClick={props.onLogout}
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
