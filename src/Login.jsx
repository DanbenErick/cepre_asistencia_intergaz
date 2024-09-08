import React, { useState } from "react";
import axios from 'axios'

const LoginPage = ({ logined, setLogined }) => {
  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
  });

  const autenticado = async () => {
    // setLogined(true);
    alert(`Credenciales ${formData.usuario} ${formData.password}`);
    const result_login = await axios.post('http://localhost:8004/cepre-login', { usuario: formData.usuario, password: formData.password });
    console.log(result_login)
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
          <img src={`${process.env.PUBLIC_URL}/undac_admision.jpg`} alt="Admisión UNDAC" />
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
        <div className="mb-3">
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={autenticado}>
            Continuar
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
