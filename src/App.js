import React from 'react'
import './App.css';
import BarcodeScanner from './ScannerBarCode';
import LoginPage from './Login';
import { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import OpinionDocentePage from './OpinionDocentePage';

function App() {
  const [logined, setLogined] = useState(false)
  return (
    <div className="App">
      
      <Router>
        <Routes>
          <Route path='/' element={logined ? <BarcodeScanner /> : <LoginPage logined={logined} setLogined={setLogined} />} />
          <Route path='/opinion-docente' element={<OpinionDocentePage />} />
        </Routes>
      </Router>
        
      
    
    </div>
  );
}

export default App;
