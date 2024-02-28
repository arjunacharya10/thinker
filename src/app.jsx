import React from 'react'
import { Tldraw } from "@tldraw/tldraw";
import './app.css'

export default function App () {

  return (
      <div style={{ position: 'fixed', inset: 0 }}>
        <Tldraw persistenceKey='thinker'/>
      </div>
  )
}