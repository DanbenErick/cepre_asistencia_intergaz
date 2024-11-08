import React, { useCallback, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from "@zxing/library";
import axios from 'axios'
const AccesoDirectorFichaPage = () => {
  const webcamRef = React.useRef(null);
  const [lastBarcode, setLastBarcode] = useState(null);  // Para evitar múltiples detecciones del mismo código
  const [barcode, setBarcode] = useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const handleClose = () => setShowModal(false);

  


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
          console.log(result.text);
          if (result.text !== lastBarcode) {
            let result_axios
            console.log("Enviando solicitud")
            result_axios = await axios.get(`https://admisionundac.com:7000/input-controls/direccion-dara-fichas?uuid=${result.text}&password=${localStorage.getItem('passwordMentira')}}`);
            console.log(result_axios)
            
            alert("reconocido", result_axios.data.NOMBRES)
            
          }
        }
      } catch (err) {
        console.warn("No barcode detected", err);
        
      }

      setTimeout(captureBarcode, 500);  // Reduce la frecuencia de captura a cada 500ms
    };

    captureBarcode();

    return () => {
      isActive = false;
    };
  }, [handleBarcodeRead, lastBarcode]);

  const accederDirector = () => {
    setShowModal(true);
    alert("Accediendo al sistema")
    localStorage.setItem('passwordMentira', 'amor-serrano-peruano')
  }
  return (
    <>
    <div>
      <h1>Acceso Director Ficha</h1>
      
    </div>
    <div className="container-form">
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">Contraseña</label>
        <input 
          type="text" 
          className="form-control mb-3" 
          // value={dniEstudiante}
          // onChange={(e) => {setDNIEstudiante(e.target.value); setDataGraph([])}}
          placeholder="Ingrese la contraseña aqui"  />
        <button className='btn btn-primary' style={{ width: '100%' }} onClick={accederDirector}>Acceder</button>
      </div>
    </div>


    <Webcam
      style={{ 'width': '80%', 'max-width': '80%' }}
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      videoConstraints={{
        facingMode: "environment",
      }}
    />



    {/* Modal */}
    <Modal className='modal-dialog-centered' show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Solicitud de Permiso</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <div className="mb-3">
            <label className="form-label">Sustenta tu permiso</label>
            <textarea className='form-control' rows="4" minLength={100} onChange={(e) => setSustentoPermiso(e.target.value)} required></textarea>
        </div> */}
      </Modal.Body>
      <Modal.Footer>
        {/* <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={solitarPermiso}>
          Solicitar
        </Button> */}
      </Modal.Footer>
    </Modal>
    </>
  )
}

export default AccesoDirectorFichaPage  