import React from 'react';
import ReactDOM from 'react-dom';
import App from './AppHooks';
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify'
import aws_exports from './aws-exports'
Amplify.configure(aws_exports)
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
