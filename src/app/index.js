import React from 'react'
import ReactDOM from 'react-dom'

document.addEventListener("DOMContentLoaded", function() {
  let el = document.createElement('div')
  document.body.appendChild(el)
  render(el)
});

function render (el) {
  ReactDOM.render(
    <h1>Hello, world! y ep foo</h1>,
    el
  );
}

// Reloads client script on update
if (module.hot) {
  module.hot.accept()
}