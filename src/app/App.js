import React from 'react'
import { hot  } from 'react-hot-loader/root'
import Widget from './Widget'

function App (props) {
  return (
    <div>
      <h1>Hello, world! yaep asafaAAbs ll foo</h1>
      ok cool well this is nice. like really nice.
      <p>ok was</p>
      <Widget suffix='woot'/>
    </div>
  )
}

const HotApp = hot(App)

export default HotApp

