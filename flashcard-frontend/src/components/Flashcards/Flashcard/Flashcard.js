import React from 'react';
import '../Flashcards.css';
import IconButton from "@material-ui/core/IconButton";
import RemoveIcon from "@material-ui/icons/Remove";

const Flashcard = (props) => {

  return <div>
    <div className="meaningTranslation">
      {
        <div className="meaningTranslation">
          <div>
            <IconButton
              onClick={props.removeFlashcard.bind(this, props.flashcard._id)}
              size="small"
              variant="contained"
              color="secondary">
              <RemoveIcon fontSize="inherit" />
            </IconButton>
          </div>
          <div className="card">
            <div className="content" dangerouslySetInnerHTML={{__html: props.flashcard.from}}/>
            <div className="content" dangerouslySetInnerHTML={{__html: props.flashcard.to}}/>
          </div>
        </div>
      }
    </div>
  </div>;
};

export default Flashcard;
