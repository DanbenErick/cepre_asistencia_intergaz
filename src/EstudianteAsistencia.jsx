import React from 'react';
import axios from 'axios'
import Swal from 'sweetalert2'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Modal, Button } from 'react-bootstrap';
const API = process.env.REACT_APP_API_URL

const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];


const EstudianteAsistencia = () => {
  const [dniEstudiante, setDNIEstudiante] = React.useState()
  const [nombreEstudiante ,setNombreEstudiante] = React.useState()
  const [sustentoPermiso, setSustentoPermiso] = React.useState('')
  const [dataGraph, setDataGraph] = React.useState({})
  const [showModal, setShowModal] = React.useState(false);
  const [dataAsistencia, setDataAsistencia] = React.useState([])

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const data = [];

  const searchEstudiate = async() => {
    // alert(dniEstudiante)
    const resp = await axios.get(API + '/cepre-obtener-asisntencia-estudiante?DNI='+dniEstudiante)
    setNombreEstudiante(resp.data.data.NOMBRE_COMPLETO)
    setDataAsistencia([resp.data.data.TEMPRANO, resp.data.data.TARDE])
    setDataGraph([
      { name:'Asistencia', value: resp.data.data.TEMPRANO},
      { name:'Tardes', value: resp.data.data.TARDE},
      { name: 'Faltas', value: 15 },
      { name: 'Días Faltantes', value: 30 },
    ])
    // setDataGraph(resp.data.data)
  }
  const solitarPermiso = async() => {
    try {
      const response = await axios.post(API + '/cepre-solicitar-permiso', {
        DNI: dniEstudiante,
        SUSTENTO: sustentoPermiso,
      });
  
      if (response && response.status === 200 && response.data.ok) {
        Swal.fire({
          title: "CEPRE",
          text: "Ingreso correctamente",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo procesar la solicitud",
          icon: "error",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Swal.fire({
          title: "Aviso!",
          text: "Ya solicitaste un permiso para hoy.",
          icon: "warning",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Error del servidor o problema con la solicitud.",
          icon: "error",
        });
      }
    }
  }
  return (
    <div className="w-full h-96">
      <div className="hero  text-center text-md-start p-5" style={{ background: '#273043' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              {/* <img src={`${process.env.PUBLIC_URL}/undac_admision.jpg`} alt="Hero Image" className="img-fluid p-2" width={100} /> */}
            </div>
            <div className="col-md-6">
              <h1 className="display-4 fw-bold text-light">ASISTENCIA ESTUDIANTE</h1>
              <a href="#" className="btn btn-primary btn-lg mt-3 mb-2">CENTRO PREUNIVERSITARIO</a>
            </div>
          </div>
        </div>
      </div>


      <div className="container-form">
        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">DNI estudiante</label>
          <input 
            type="text" 
            className="form-control mb-3" 
            value={dniEstudiante}
            onChange={(e) => {setDNIEstudiante(e.target.value); setDataGraph([])}}
            placeholder="DNI"  />
          <button className='btn btn-primary' style={{ width: '100%' }} onClick={searchEstudiate}>Buscar</button>
        </div>
      </div>

      <h4 className='text-center fw-bold p-2'>{nombreEstudiante}</h4>
      <div className="container-table p-2">
        <table class="table  p-2">
          <thead>
            <tr>
              <th scope="col">CONCEPTO</th>
              <th scope="col">CANTIDAD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">ASISTENCIA</th>
              <td>{dataAsistencia[0]}</td>
            </tr>
            <tr>
              <th scope="row">TARDE</th>
              <td>{dataAsistencia[1]}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <ResponsiveContainer width={400} height={400}>
        <PieChart>
          <Pie
            data={dataGraph}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {
        dataGraph.length === 0 
        ?
          ''
        :
          <div className="container-form">
            <button className='btn btn-primary' style={{ width: '100%' }} onClick={handleShow}>Solicitar permiso</button>
          </div>
      }
      



      {/* Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Solicitud de Permiso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
              <label className="form-label">Sustenta tu permiso</label>
              <textarea className='form-control' rows="4" minLength={100} onChange={(e) => setSustentoPermiso(e.target.value)} required></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={solitarPermiso}>
            Solicitar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EstudianteAsistencia;