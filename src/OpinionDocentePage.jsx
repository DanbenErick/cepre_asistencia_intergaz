import React from 'react';
import axios from 'axios'
const API = process.env.REACT_APP_API_URL
const OpinionDocentePage = () => {
  const [selectDocente, setSelectDocente] = React.useState([])

  const getData = async() => {
    try {
      const url = API + '/cepre-obtener-docentes'
      const resp = await axios.get(url)
      setSelectDocente(resp.data.data)
    } catch (error) {
      console.error('Error:', error);
    }
  }
  React.useEffect(() => {
    getData()
  },[])

  return (
    <div>
      <div className="hero  text-center text-md-start p-5" style={{ background: '#273043' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              {/* <img src={`${process.env.PUBLIC_URL}/undac_admision.jpg`} alt="Hero Image" className="img-fluid p-2" width={100} /> */}
            </div>
            <div className="col-md-6">
              <h1 className="display-4 fw-bold text-light">CENTRO PREUNIVERSITARIO</h1>
              <p className="lead text-light">
                Da la opinion de tu docente
              </p>
              <a href="#" className="btn btn-primary btn-lg mt-3 mb-2">UNIVERSIDAD DANIEL ALCIDES CARRION</a>
            </div>
          </div>
        </div>
      </div>


      <div className="form-container p-4">
        {/* <h2>Formulario de Calificación</h2> */}
        <form action="#" method="POST">
            <div className="mb-3">
                <label className="form-label">DNI Estudiante</label>
                <input className='form-control' maxLength={8} required />
            </div>

            <div className="mb-3">
                <label className="form-label">Selecciona el Profesor</label>
                <select className='form-control' required>
                    <option value="">-- Selecciona --</option>
                    {
                      selectDocente.map(element => {
                        return  <option value={element.ID}>{element.NOMBRES} - {element.MATERIA}</option> 
                      })
                    }
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Calificación</label>
                <select className='form-control' required>
                    <option value="">-- Selecciona --</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Comentarios</label>
                <textarea className='form-control' rows="4" required></textarea>
            </div>

            <div className="mb-3">
                <button className='btn btn-primary btn-lg' style={{ width: '100%' }}>Enviar opinion</button>
            </div>
        </form>
    </div>
    </div>
  )
}

export default OpinionDocentePage;