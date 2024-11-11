import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Badge, Button, Col, Container, Image, Modal, Row, Table } from 'react-bootstrap'
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from "@zxing/library";
import axios from 'axios'
const AccesoDirectorFichaPage = () => {
  const webcamRef = React.useRef(null);
  const [lastBarcode, setLastBarcode] = useState(null);  // Para evitar múltiples detecciones del mismo código
  const [barcode, setBarcode] = useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [showModalCamara, setShowModalCamara] = React.useState(false);
  const [dataPersonalPostulante, setDataPersonalPostulante] = useState([]);
  const [showCamara, setShowCamara] = useState(false);

  const inputClaveRef = useRef(null)
  const [showModalIframe, setShowModalIframe] = useState(false)
  

  const handleClose = () => setShowModal(false);
  const handleCloseCamara = () => setShowModalCamara(false);
  const handleCloseIframe = () => setShowModalIframe(false);

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
            // result_axios = await axios.get(`http://localhost:3500/input-controls/direccion-dara-fichas?uuid=${result.text}&password=${localStorage.getItem('passwordMentira')}`);
            if(result_axios.status === 200 && result_axios.data != null) {
              setShowModal(true);
              setDataPersonalPostulante(result_axios.data)
            }
            console.log(result_axios)
            
            // alert("reconocido", result_axios.data.NOMBRES)

          }else {
            console.log('Mismo QRcode!!!')
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
  }, [handleBarcodeRead, lastBarcode, showModalCamara]);

  const accederDirector =  async() => {
    // localStorage.setItem('passwordMentira', 'amor-serrano-peruano')
    localStorage.setItem('passwordMentira', inputClaveRef.current.value)
    // const resp = await axios.get(`http://localhost:3500/input-controls/autenticar-lector-qr-director?password=${inputClaveRef.current.value}`)
    const resp = await axios.get(`https://admisionundac.com:7000/input-controls/autenticar-lector-qr-director?password=${inputClaveRef.current.value}`)
    if(resp.status === 200 && resp.data.ok) {

      setShowModalCamara(true)
    }else {
      alert("Autenticacion incorrecta")
    }
  }
  return (
    <>
    <div>
      <Container fluid className="bg-dark text-white p-5" style={{ minHeight: '40vh' }}>
        <Row className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
          <Col md={8} className="text-center">
            <h1 className="display-3">¡Direccion Admision!</h1>
            <p className="lead">
              Lector de QRcode de fichas de inscripcion
            </p>
          </Col>
        </Row>
      </Container>
    </div>
    
      <div className="container-form">
        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">Palabra clave</label>
          <input 
            type="text" 
            className="form-control mb-3" 
            ref={inputClaveRef}
            placeholder="Ingrese la contraseña aqui"  />
          <button className='btn btn-primary' style={{ width: '100%' }} onClick={accederDirector}>Acceder</button>
        </div>
      </div>
    

    <Modal show={showModalCamara} onHide={handleCloseCamara}>
    <Modal.Header closeButton>
      <Modal.Title>Lector QR</Modal.Title>
    </Modal.Header>
     <Modal.Body>
        <Webcam
            style={{ 'width': '100%', 'max-width': '100%' }}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: "environment",
            }}
          />
      </Modal.Body> 
    </Modal>



    {/* Modal */}
    <Modal className='modal-dialog-centered' show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Informacion postulante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          {
            dataPersonalPostulante.length > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Image src={`https://admisionundac.com:7000/${dataPersonalPostulante[0].DNI}/${dataPersonalPostulante[0].DNI}.jpeg`} alt='Foto de postulante' roundedCircle style={{width: '70%', height:'70%'}} />
                </div>
                

                <h4 style={{ fontWeight:'bold' }}>Postulante</h4>
                <Table bordered hover>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight:'bold' }}>DNI</td>
                      <td>{dataPersonalPostulante[0].DNI}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight:'bold' }}>Nombre Completo</td>
                      <td>{dataPersonalPostulante[0].AP_PATERNO} {dataPersonalPostulante[0].AP_MATERNO} {dataPersonalPostulante[0].NOMBRES}</td>
                      
                    </tr>
                    <tr>
                      <td style={{ fontWeight:'bold' }}>Colegio</td>
                      <td>{dataPersonalPostulante[0].NOMBRE_COLEGIO}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight:'bold' }}>Direccion</td>
                      <td>{dataPersonalPostulante[0].DIRECCION}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight:'bold' }}>Nacimiento</td>
                      <td>{dataPersonalPostulante[0].FECHA_NACIMIENTO}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight:'bold' }}>Lugar</td>
                      <td>{dataPersonalPostulante[0].DEPARTAMENTO} {dataPersonalPostulante[0].PROVINCIA} {dataPersonalPostulante[0].DISTRITO}</td>
                    </tr>
                  </tbody>
                </Table>

                <br />

                <h4 style={{ fontWeight:'bold' }}>Apoderado</h4>
                <Table  bordered hover>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight:'bold' }}>DNI</td>
                      <td>{dataPersonalPostulante[0].DNI_APO}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight:'bold' }}>Nombre Completo</td>
                      <td>{dataPersonalPostulante[0].NOMBRE_COMPLETO_APO}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight:'bold' }}>Celular</td>
                      <td>{dataPersonalPostulante[0].CELULAR_APO}</td>
                    </tr>
                  </tbody>
                </Table>
                
                <br />  

                <h4 style={{ fontWeight:'bold' }}>Procesos que participo</h4>
                <Table striped bordered hover>
                  <thead>
                    <tr style={{ fontSize: '10px' }}>
                      <th>Proceso</th>
                      <th>Carrera</th>
                      <th>Puesto</th>
                      <th>Puntaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPersonalPostulante.map(data => (
                      <tr style={{ fontSize: '10px' }}>
                        <td>{data.NOMBRE_PROCESO}</td>
                        <td>{data.ESCUELA_COMPLETA}</td>
                        <td>{data.ORDEN_MERITO_1}</td>
                        <td>{data.PUNT_T}</td>
                      </tr>
                      // <Badge bg="success">{data.NOMBRE_PROCESO} | {data.ESCUELA_COMPLETA} - {data.ORDEN_MERITO_1} - {data.PUNT_T}</Badge>
                    ))}
                  </tbody>
                </Table>
                <Button variant='danger' onClick={ () => { setShowModalIframe(true) }}>PDF</Button>

              </>
            )
          }
            
        </div>
      </Modal.Body>
    </Modal>




    {/* Modal de react-bootstrap */}
    <Modal show={showModalIframe} onHide={handleCloseIframe} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>PDF</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* iframe embebido en el modal */}
        <iframe
          
          src={`https://admisionundac.com:7000/${dataPersonalPostulante[0].DNI}/${dataPersonalPostulante[0].DNI}.pdf`}
          title="Iframe Modal"
          width="100%"
          height="400px"
          style={{ border: "none" }}
        ></iframe>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseIframe}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>

    </>
  )
}

export default AccesoDirectorFichaPage  