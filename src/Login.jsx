import React, { useState } from 'react'

const LoginPage = ({ logined, setLogined }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  })

  const autenticado = () => {
    setLogined(true)
    alert(`Credenciales ${formData.usuario} ${formData.password}`)
  }
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value, // Actualiza solo el campo correspondiente en el estado
    });
  }

  return (
    <div>
      <div className="login-container">
        <h1 className="login-title">Iniciar Sesión</h1>
        <form className="login-form">
            <div className="input-group">
                <label>Correo Electrónico</label>
                <input
                  type="text"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleInputChange}
                />
            </div>
            <div className="input-group">
                <label>Contraseña</label>
                <input 
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
            </div>
            <button type="button" onClick={autenticado} className="login-button">Ingresar</button>
        </form>
    </div>
    </div>
  )
}

export default LoginPage