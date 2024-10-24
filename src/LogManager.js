import React, { useState } from 'react';
import "./App.css";
import axios from 'axios';

const LogManager = () => {
  const [empresa, setEmpresa] = useState('');
  const [titulos, setTitulos] = useState([]);
  const [titulosSeleccionados, setTitulosSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const empresas = ['MRG', 'Rubicon', 'GERP', 'Godiz', 'OCC'];

  const handleBuscarLogs = async () => {
    if (!empresa) {
      setMensaje('Por favor, selecciona una empresa.');
      return;
    }

    try {
      setCargando(true);
      const response = await axios.post('https://flask-five-jade.vercel.app/listar-titulos', { empresa });

      if (response.data && response.data.titulos) {
        setTitulos(response.data.titulos);
        setMensaje('');
      } else {
        setMensaje('No se encontraron logs.');
      }
    } catch (error) {
      console.error(error); 
      setMensaje('Error al buscar los logs. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const handleSeleccionarLog = (id) => {
    setTitulosSeleccionados(prevSeleccionados => {
      if (prevSeleccionados.includes(id)) {
        return prevSeleccionados.filter(tituloId => tituloId !== id); 
      } else {
        return [...prevSeleccionados, id];
      }
    });
  };

  const handleEliminarLog = async () => {
    if (titulosSeleccionados.length === 0) {
      setMensaje('Por favor, selecciona al menos un log para eliminar.');
      return;
    }

    const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar los logs seleccionados?`);
    if (!confirmacion) return;

    try {
      setCargando(true);
      await axios.post('https://flask-five-jade.vercel.app/eliminar-log', { 
        empresa, 
        ids: titulosSeleccionados
      });

      setMensaje('Logs eliminados exitosamente.');
      setTitulos(titulos.filter(titulo => !titulosSeleccionados.includes(titulo.id))); 
      setTitulosSeleccionados([]);
    } catch (error) {
      console.error(error);
      setMensaje('Error al eliminar los logs. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
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
                    type="checkbox" 
                    name="titulo"
                    value={titulo.id}
                    checked={titulosSeleccionados.includes(titulo.id)}
                    onChange={() => handleSeleccionarLog(titulo.id)}
                  />
                  {titulo.titulo} - {titulo.fecha}
                </label>
              </li>
            ))}
          </ul>
          
          <div className="button-container">
            <button className="danger-button" onClick={handleEliminarLog} disabled={cargando}>
              {cargando ? 'Eliminando...' : 'Eliminar Logs'}
            </button>
          </div>
        </div>
      )}

      <img
        src="https://cdn-icons-png.flaticon.com/512/0/340.png"
        alt="Volver"
        className="redirect-icon"
        onClick={handleRedirect}
        style={{ cursor: "pointer", width: "50px", height: "50px" }} 
      />
    </div>
  );
};

export default LogManager;
