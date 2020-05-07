import React from 'react';
import './Meaning.css';
import MeaningTranslation from "./MeaningTranslation/MeaningTranslation";

const Meaning = (props) => {

  return <div>
    <div className="info" dangerouslySetInnerHTML={{__html: props.meaning.header}}/>
    <div className="translations">
      {props.meaning.translations.map(it => {
        const from = it.source;
        const to = it.target;
        return (
          <MeaningTranslation
            meaning={it}
            flashcard={props.getFlashcard(from, to, props.fromLang, props.toLang)}
            from={from}
            to={to}
            fromLang={props.fromLang}
            toLang={props.toLang}
            key={from + to}
          />
        );
      })}
    </div>
  </div>;
};

export default Meaning;
