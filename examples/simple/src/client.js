import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export default (el) =>  {
  ReactDOM.hydrate(<App />, el);
  console.log('render');
}
