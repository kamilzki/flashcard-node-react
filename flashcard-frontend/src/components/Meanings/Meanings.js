import React from 'react';
import Meaning from "./Meaning/Meaning";
import './Meanings.css';

const Meanings = (props) => {

  return <div className="meanings">
      {props.translations.map((meaning, index) => (
        <Meaning meaning={meaning} key={index}/>
      ))}
  </div>;
};

export default Meanings;