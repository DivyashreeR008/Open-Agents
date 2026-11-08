import { useCallback, useState, StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AgentsProvider } from './lib/useAgents'
import App from './App'
import Preloader from './components/Preloader'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AgentsProvider>
        <PreloaderApp />
      </AgentsProvider>
    </BrowserRouter>
  </StrictMode>
)

function PreloaderApp() {
  const [preloaderDone, setPreloaderDone] = useState(false)
  const finishPreloader = useCallback(() => setPreloaderDone(true), [])

  return (
    <>
      <div
        aria-hidden={preloaderDone ? undefined : true}
        aria-busy={preloaderDone ? undefined : true}
        inert={preloaderDone ? undefined : true}
      >
        <App />
      </div>
      {!preloaderDone && <Preloader onFinish={finishPreloader} />}
    </>
  )
}
