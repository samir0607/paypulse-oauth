import './App.css'
import { ConnectButton } from './components/ConnectSAPButton'

function App() {
  return (
    <>
      <div className="card">
        <ConnectButton type="sap"/>
        <ConnectButton type="oracle"/>
      </div>
    </>
  )
}

export default App
