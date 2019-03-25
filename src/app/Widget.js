import React, { useState, useMemo } from 'react'

export default function Widget (props) {
    const { suffix = 'empty' } = props
    const [state, setState] = useState('')
    const text = useMemo(() => state.toUpperCase() + suffix, [state])
    return (
      <div>
        <hr />
        <input onChange={e => setState(e.target.value)} />
        <h4>{text}</h4>
      </div>
    )
}
