import React from 'react';
import ReactDOM from 'react-dom/server';
import App from './App';

export const getMarkup = () => {
  return ReactDOM.renderToString(<App />);
};
