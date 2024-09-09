import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const LoginPage = ({ logined, setLogined }) => {
  const [estadoAsistencia, setEstadoAsistencia] = useState('SALIDA');
  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
  });

  const handleRadioButton = async(event) => {
    const value = event.target.value;
    setEstadoAsistencia(value); // Actualiza el estado local
    localStorage.setItem('ESTADO_CEPRE', value);
  }

  React.useEffect(() => {
    localStorage.setItem('ESTADO_CEPRE', 'ENTRADA')
  },[])

  const autenticado = async () => {
    const result_login = await axios.post(
      "https://cepre-asistencia-3.onrender.com/cepre-login",
      { usuario: formData.usuario, password: formData.password }
    );
    if (result_login && result_login.status === 200 && result_login.data.ok) {
      localStorage.setItem("uuid", result_login.data.uuid);
      Swal.fire({
        title: "CEPRE",
        text: "Ingreso correctamente",
        icon: "success",
      });
    }
    setLogined(true);
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value, // Actualiza solo el campo correspondiente en el estado
    });
  };

  return (
    <>
      <div className="background-login"></div>
      <div className="PageLogin">
        <div className="container-form">
          <h2 className="" style={{ fontWeight: "bold" }}>
            <img
              src={`${process.env.PUBLIC_URL}/undac_admision.jpg`}
              alt="Admisión UNDAC"
            />
            CEPRE - UNDAC
          </h2>
          <div className="mb-3">
            <label for="exampleFormControlInput1" className="form-label">
              Usuario
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Usuario"
              value={formData.usuario}
              name="usuario"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label for="exampleFormControlInput1" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={formData.password}
              name="password"
              onChange={handleInputChange}
            />
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="flexRadioDefault"
              value="ENTRADA"
              checked={estadoAsistencia === 'ENTRADA'}
              onChange={handleRadioButton}
            />
            <label class="form-check-label">ENTRADA</label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="flexRadioDefault"
              value="SALIDA"
              checked={estadoAsistencia === 'SALIDA'}
              onChange={handleRadioButton}
            />
            <label class="form-check-label">SALIDA</label>
          </div>
          <div className="mb-3">
            <button
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={autenticado}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
