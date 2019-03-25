import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// Reloads client script on update
if (module.hot) {
  module.hot.accept()
}
