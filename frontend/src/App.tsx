import './App.css'
import { ConnectButton } from './components/ConnectButton'

function App() {
  return (
    <>
      <div className="card">
        <div>Integrate</div>
        <ConnectButton companyId={1} provider='oracle'/>
        <ConnectButton companyId={1} provider='sap'/>
      </div>
    </>
  )
}

export default App
