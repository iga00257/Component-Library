import { useState } from 'react'
import Tooltip from './components/Portal/ToolTip'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Tooltip Demo</h1>
      <Tooltip title='This is a tooltip' placement='top'>
        <button className='tooltip-button'>Hover over me</button>
      </Tooltip>
    </>
  )
}

export default App
