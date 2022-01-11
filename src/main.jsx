import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { useStore } from './store';

function Input() {
  const reset = useStore(store => store.reset);
  return (
    <div style={{position: 'fixed', color: 'white', zIndex: 1, padding: '10px'}}>
      <h1>XRDLE</h1>
      <span>Wordle, but in XR. Soon...</span>
      <div>
        <button onClick={() => {
          reset();
        }}>Reset</button>
        </div>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Input />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
