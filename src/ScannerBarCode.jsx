import axios from 'axios';
import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader } from "@zxing/library";
import "./App.css";
import "./scanner.css";

const BarcodeScanner = () => {
  const webcamRef = useRef(null);
  const [classBackground, setClassBackground] = useState("background");
  const [barcode, setBarcode] = useState(null);
  const [contador, setContador] = useState(0);
  const [lastBarcode, setLastBarcode] = useState(null);  // Para evitar múltiples detecciones del mismo código

  const handleBarcodeRead = useCallback((result) => {
    if (result && result.text !== lastBarcode) {
      setBarcode(result.text);
      setLastBarcode(result.text);  // Actualizar último código detectado
    }
  }, [lastBarcode]);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let isActive = true;

    const captureBarcode = async () => {
      if (!webcamRef.current || !isActive) return;

      try {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          const result = await codeReader.decodeFromImage(undefined, imageSrc);
          handleBarcodeRead(result);

          if (result.text !== lastBarcode) {
            let result_axios
            if(localStorage.getItem('ESTADO_CEPRE') === 'ENTRADA') {
              result_axios = await axios.post('https://cepre-asistencia-3.onrender.com/cepre-ingreso', { dni: result.text, responsable: 'bb68fd33-6bcc-11ef-a1c0-9a1cd2c52600' });
            }
            if(localStorage.getItem('ESTADO_CEPRE') === 'SALIDA') {
              result_axios = await axios.post('https://cepre-asistencia-3.onrender.com/cepre-salida', { dni: result.text, responsable: 'bb68fd33-6bcc-11ef-a1c0-9a1cd2c52600' });

            }
            

            if (result_axios.status === 200) {
              setContador(contador + 1);
              setClassBackground("background success-background");
            } else {
              setClassBackground("background warning-background");
            }
          }
        }
      } catch (err) {
        console.warn("No barcode detected", err);
        setClassBackground("background error-background");
      }

      setTimeout(captureBarcode, 500);  // Reduce la frecuencia de captura a cada 500ms
    };

    captureBarcode();

    return () => {
      isActive = false;
    };
  }, [handleBarcodeRead, lastBarcode, contador]);

  const getEntradaHoy = async() => {
    const result_axios = await axios.get('https://cepre-asistencia-3.onrender.com/cepre-asistencia-entrada-hoy');
    console.log(result_axios.data);
  }
  const getEntradaMes = async() => {
    const result_axios = await axios.get('https://cepre-asistencia-3.onrender.com/cepre-asistencia-entrada-mes');
    console.log(result_axios.data);
  }
  const getEntradaTotal = async() => {
    const result_axios = await axios.get('https://cepre-asistencia-3.onrender.com/cepre-asistencia-entrada-total');
    console.log(result_axios.data);
  }

  return (
    <>
      <div className={classBackground}></div>
      <div className="container-webcam">
        <h1 className='title-webcam'>ASISTENCIA CEPRE</h1>
        <div className="container_buttons" style={{width: '100%'}}>
          <button className='btn btn-secondary '>Contador {contador}</button>
          <button className='btn btn-secondary'>DNI {barcode}</button>
        </div>
        <div>
          <Webcam
            style={{ 'width': '80%', 'max-width': '80%' }}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: "environment",
            }}
          />
          <div className="container_buttons">
            <button className='btn btn-primary' onClick={getEntradaHoy}>Asistencias Hoy</button>
            <button className='btn btn-primary' onClick={getEntradaMes}>Asistencias Mes</button>
            <button className='btn btn-primary' onClick={getEntradaTotal}>Asistencias Total</button>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default BarcodeScanner;
