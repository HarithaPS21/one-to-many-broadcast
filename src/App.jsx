import { useState } from 'react'
import './App.css';
import Viewer from './components/Viewer';
import BroadCaster from './components/Broadcaster';

function App() {
  const [mode, setMode] = useState(null);

  return (
    <div className='App'>
      <h1>One-To-Many Video Conference</h1>
      {
        !mode && (
          <>
            <button onClick={() => setMode("broadcast")}>I'm the Broadcaster</button>
            <button onClick={() => setMode("viewer")}>I'm the Viewer</button>
          </>
        )
      }
      {mode === "broadcast" && <BroadCaster />}
      {mode === "viewer" && <Viewer />}
    </div>
  )
}

export default App
