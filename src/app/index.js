import React from 'react'
import ReactDOM from 'react-dom'

function App (props) {
  return (
    <div>
      <h1>Hello, world! yaep asaf</h1>,
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// Reloads client script on update
if (module.hot) {
  module.hot.accept()
}