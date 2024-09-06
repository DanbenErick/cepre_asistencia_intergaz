import logo from './logo.svg';
import './App.css';
import BarcodeScanner from './ScannerBarCode';
import LoginPage from './Login';
import { useState } from 'react';

function App() {
  const [logined, setLogined] = useState(false)
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      {
        logined? <BarcodeScanner /> : <LoginPage logined={logined} setLogined={setLogined} />
      }
      
        
      
    
    </div>
  );
}

export default App;
