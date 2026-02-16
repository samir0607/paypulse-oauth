import './App.css'
import { ConnectButton } from './components/ConnectButton'

function App() {
  return (
    <>
      <div className="card">
        <div>Integrate</div>
        <ConnectButton companyId={3} provider='oracle'/>
        <ConnectButton companyId={3} provider='sap'/>
      </div>
    </>
  )
}

export default App
