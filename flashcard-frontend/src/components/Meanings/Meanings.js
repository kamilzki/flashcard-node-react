import React from 'react';
import Meaning from "./Meaning/Meaning";
import './Meanings.css';

const Meanings = (props) => {

  return <div className="meanings">
      {props.translations.map((meaning, index) => (
        <Meaning
          getFlashcard={props.getFlashcard}
          meaning={meaning}
          fromLang={props.fromLang}
          toLang={props.toLang}
          key={index}
        />
      ))}
  </div>;
};

export default Meanings;