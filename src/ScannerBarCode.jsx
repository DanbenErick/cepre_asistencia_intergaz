import axios from 'axios';
import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader } from "@zxing/library";
import Swal from 'sweetalert2'
import "./App.css";
import "./scanner.css";
import { Modal, Button } from 'react-bootstrap';

const API = process.env.REACT_APP_API_URL
const BarcodeScanner = () => {
  const webcamRef = useRef(null);
  const [classBackground, setClassBackground] = useState("background");
  const [barcode, setBarcode] = useState(null);
  const [contador, setContador] = useState(0);
  const [lastBarcode, setLastBarcode] = useState(null);  // Para evitar múltiples detecciones del mismo código
  const [showModal, setShowModal] = useState(false)
  const [dniPermiso ,setDNIPermiso] = useState('')
  const [dataEstudiantePermiso, setDataEstudiantePermiso] = useState(null)

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
              result_axios = await axios.post(API + '/cepre-ingreso', { dni: result.text, responsable: 'bb68fd33-6bcc-11ef-a1c0-9a1cd2c52600' });
            }
            if(localStorage.getItem('ESTADO_CEPRE') === 'SALIDA') {
              result_axios = await axios.post(API + '/cepre-salida', { dni: result.text, responsable: 'bb68fd33-6bcc-11ef-a1c0-9a1cd2c52600' });

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
    window.location.href = `${API}/cepre-asistencia-entrada-hoy`;
  }
  const getEntradaMes = async() => {
    window.location.href = `${API}/cepre-asistencia-entrada-mes`;
  }
  const getEntradaTotal = async() => {
    window.location.href = `${API}/cepre-asistencia-entrada-total`;
  }

  const consultarPermiso = async() => {
    try {
      const resp = await axios.get(API + '/cepre-consultar-permiso?DNI=' + dniPermiso)
      // debugger
      if(resp && resp.status === 200 && resp.data.ok) {
        console.log(resp.data)
        setDataEstudiantePermiso(resp.data.result[0])
      }else if(resp.data.ok === false) {
        Swal.fire({
          icon: 'warning',
          text: 'El estudiantes no registro permiso'
        })
      }
      else {
        Swal.fire('Ocurrio un error')
      }
    }catch(e) {
      console.error(e);
    }
  }

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

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
            <button className='btn btn-primary' onClick={handleShowModal}>Permisos</button>
          </div>
        </div>
      </div>
      

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Permiso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
              <label className="form-label">DNI del Estudiante</label>
              <input className='form-control' onChange={(e) => setDNIPermiso(e.target.value)} />
              {/* <textarea className='form-control' rows="4" minLength={100} onChange={(e) => setSustentoPermiso(e.target.value)} required></textarea> */}

              <div className="container-table p-2">
              {
                dataEstudiantePermiso != null
                ?
                <>
                  <h4 className='fw-bold text-center p-3'>Informacion de permiso</h4>
                  <table class="table p-2">
                    <tbody>
                      <tr>
                        <th scope="row">DNI</th>
                        <td>{dataEstudiantePermiso['DNI']}</td>
                      </tr>
                      <tr>
                        <th scope="row">Estudiante</th>
                        <td>{dataEstudiantePermiso['NOMBRE_COMPLETO']}</td>
                      </tr>
                      <tr>
                        <th scope="row">Motivo</th>
                        <td>{dataEstudiantePermiso['SUSTENTO']}</td>
                      </tr>
                      <tr>
                        <th scope="row">Fecha</th>
                        <td>{new Date(dataEstudiantePermiso['FECHA']).toISOString().split('T')[0] } - {dataEstudiantePermiso['HORA']}</td>
                      </tr>
                    </tbody>
                  </table>
                </>
                :
                ''
              }

            </div>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={consultarPermiso}>
            Consultar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BarcodeScanner;
