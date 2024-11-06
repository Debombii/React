import React, { useState } from 'react';
import "./App.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogManager = () => {
  const [empresa, setEmpresa] = useState('');
  const [titulos, setTitulos] = useState([]);
  const [tituloSeleccionado, setTituloSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const empresas = ['MRG', 'Rubicon', 'GERP', 'Godiz', 'OCC'];

  const handleBuscarLogs = async () => {
    if (!empresa) {
      setMensaje('Por favor, selecciona una empresa.');
      return;
    }
    try {
      setCargando(true);
      const response = await axios.post('https://flask-five-jade.vercel.app/listar-titulos', { empresa });
      if (response.data && response.data.titulos && response.data.titulos.length > 0) {
        setTitulos(response.data.titulos);
        setMensaje('');
      } else {
        setTitulos([]); 
        setMensaje('No se encontraron logs en esta empresa.'); 
      }
    } catch (error) {
      console.error(error); 
      setMensaje('Error al buscar los logs. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  // Función para seleccionar un log
  const handleSeleccionarLog = (id) => {
    setTituloSeleccionado(id); 
  };

  const handleObtenerContenidoLog = async (id) => {
    if (!id) {
      setMensaje('Por favor, selecciona un log.');
      return;
    }
    try {
      setCargando(true);
      const response = await axios.post('https://flask-five-jade.vercel.app/obtener-log', { empresa, id });

      if (response.data && response.data.titulo && response.data.contenido) {
        // Aquí se navega al componente de modificación, pasando el contenido del log como estado
        navigate('/modifyLogs', { state: { logContent: response.data } });
        setMensaje('');
      } else {
        setMensaje('No se encontró el contenido del log.');
      }
    } catch (error) {
      console.error(error);
      setMensaje('Error al obtener el contenido del log.');
    } finally {
      setCargando(false);
    }
  };

  const handleActualizarLog = async () => {
    if (!tituloSeleccionado) {
      setMensaje('Por favor, selecciona un log para actualizar.');
      return;
    }
    const logSeleccionado = titulos.find(titulo => titulo.id === tituloSeleccionado);

    if (logSeleccionado) {
      handleObtenerContenidoLog(tituloSeleccionado);
    }
  };

  return (
    <div className="log-manager-container">
      <h2>Gestión de Logs</h2>

      <div>
        <label htmlFor="empresa">Selecciona una empresa: </label>
        <select
          id="empresa"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
          disabled={cargando}
          className="SelectEmpresaManager"
        >
          <option value="">Seleccionar empresa</option>
          {empresas.map((empresa) => (
            <option key={empresa} value={empresa}>{empresa}</option>
          ))}
        </select>
        <button onClick={handleBuscarLogs} disabled={cargando}>Buscar</button>
      </div>

      {mensaje && <p className="message">{mensaje}</p>}

      {titulos.length > 0 && (
        <div className="log-list-container">
          <h3>Lista de Logs</h3>
          <ul>
            {titulos.map((titulo) => (
              <li key={titulo.id}>
                <label>
                  <input
                    type="radio"  // Cambio de checkbox a radio
                    name="titulo"
                    value={titulo.id}
                    checked={tituloSeleccionado === titulo.id}  // Solo se selecciona un log
                    onChange={() => handleSeleccionarLog(titulo.id)}
                  />
                  {titulo.titulo} - {titulo.fecha}
                </label>
              </li>
            ))}
          </ul>

          <div className="button-container">
            <button className="danger-button" onClick={handleActualizarLog} disabled={cargando}>
              {cargando ? 'Cargando...' : 'Actualizar Log'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogManager;
