import React from 'react';
import MeaningTranslation from "./MeaningTranslation/MeaningTranslation";
import './Meaning.css';

const Meaning = (props) => {
  return <div>
    <div className="info" dangerouslySetInnerHTML={{__html: props.meaning.header}}/>
    <div className="translations">
      {props.meaning.translations.map(it => (
        <MeaningTranslation meaning={it}/>
      ))}
    </div>
  </div>;
};

export default Meaning;
