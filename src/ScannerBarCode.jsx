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
            const result_axios = await axios.post('http://localhost:8004/cepre-ingreso', { dni: result.text, responsable: 'bb68fd33-6bcc-11ef-a1c0-9a1cd2c52600' });

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

  return (
    <>
      <div className={classBackground}></div>
      <div className="container-webcam">
        <h1>ASISTENCIA</h1>
        <h1>CEPRE</h1>
        <h1>CONTADOR {contador}</h1>
        <p>DNI: {barcode}</p>
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
        </div>
      </div>
    </>
  );
};

export default BarcodeScanner;
