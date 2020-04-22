import React, {useState} from 'react';
import './Flashcard.css';
import IconButton from "@material-ui/core/IconButton";
import RemoveIcon from "@material-ui/icons/Remove";

const Flashcard = (props) => {
  const [flip, setFlip] = useState('');

  const getFlipCardClass = () => {
    if (flip) {
      setFlip(_ => '');
    } else {
      setFlip(_ => 'rotate');
    }
  };

  return <div>
    <div className="flip-card">
      <div className={"flip-card-inner " + flip} onClick={getFlipCardClass}>
        <div className="flip-card-front">
          <div className="content" dangerouslySetInnerHTML={{__html: props.flashcard.from}}/>
        </div>
        <div className="flip-card-back">
          <div className="upperMenu">
            <span className="languageTranslation">
              <span className="languageInfo">
                {props.flashcard.fromLang + " "}
              </span>
              =>
              <span className="languageInfo">
                {props.flashcard.toLang}
              </span>
            </span>
            <IconButton
              onClick={props.removeFlashcard.bind(this, props.flashcard._id)}
              size="small"
              variant="contained"
              color="secondary">
              <RemoveIcon fontSize="inherit" />
            </IconButton>
          </div>
          <div className="content" dangerouslySetInnerHTML={{__html: props.flashcard.to}}/>
        </div>
      </div>
    </div>
  </div>;
};

export default Flashcard;
