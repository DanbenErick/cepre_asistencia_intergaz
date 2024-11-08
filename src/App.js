import React from 'react'
import './App.css';
import BarcodeScanner from './ScannerBarCode';
import LoginPage from './Login';
import { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import OpinionDocentePage from './OpinionDocentePage';
import EstudianteAsistencia from './EstudianteAsistencia';
import AccesoDirectorFichaPage from './AccesoDirectorFichaPage';

function App() {
  const [logined, setLogined] = useState(false)
  return (
    <div className="App">
      
      <Router>
        <Routes>
          <Route path='/' element={logined ? <BarcodeScanner /> : <LoginPage logined={logined} setLogined={setLogined} />} />
          <Route path='/opinion-docente' element={<OpinionDocentePage />} />
          <Route path='/estudiante-asistencia' element={<EstudianteAsistencia />} />
          <Route path='/acceso-director-ficha' element={<AccesoDirectorFichaPage />} />
        </Routes>
      </Router>
        
      
    
    </div>
  );
}

export default App;
