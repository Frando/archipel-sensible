import React from 'react'
import ReactDOM from 'react-dom'

document.addEventListener("DOMContentLoaded", function() {
  let el = document.createElement('div')
  document.body.appendChild(el)
  render(el)
});

function render (el) {
  ReactDOM.render(
    <h1>Hello, world! yes fooasd</h1>,
    el
  );
}
