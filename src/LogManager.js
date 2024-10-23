import React, { useState } from 'react';
import "./App.css";
import axios from 'axios';

const LogManager = () => {
  const [empresa, setEmpresa] = useState('');
  const [titulos, setTitulos] = useState([]);
  const [tituloSeleccionado, setTituloSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false); 

  const empresas = ['MRG', 'Rubicon', 'GERP', 'Godiz', 'OCC'];

  const handleBuscarLogs = async () => {
    if (!empresa) {
      setMensaje('Por favor, selecciona una empresa.');
      return;
    }

    try {
      setCargando(true); // Activar el estado de carga
      const response = await axios.post('https://flask-five-jade.vercel.app/listar-titulos', { empresa });
      setTitulos(response.data.titulos);
      setMensaje('');
    } catch (error) {
      setMensaje('Error al buscar los logs. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const handleEliminarLog = async () => {
    if (!tituloSeleccionado) {
      setMensaje('Por favor, selecciona un log para eliminar.');
      return;
    }

    const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar el log "${tituloSeleccionado.titulo}"?`);
    if (!confirmacion) return;

    try {
      setCargando(true); // Activar el estado de carga
      await axios.post('https://flask-five-jade.vercel.app/eliminar-log', { empresa, titulo: tituloSeleccionado.titulo });
      setMensaje('Log eliminado exitosamente.');
      setTitulos(titulos.filter(titulo => titulo.id !== tituloSeleccionado.id)); 
      setTituloSeleccionado(null); // Reiniciar selección
    } catch (error) {
      setMensaje('Error al eliminar el log. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="log-manager-container">
      <header className="header">
        <img
          src="https://www.rubiconsulting.es/wp-content/uploads/2019/08/Logo2-01.png"
          alt="Logotipo del generador"
        />
        <h1 className="title">Gestión de Logs</h1>
      </header>

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
                    type="radio"
                    name="titulo"
                    value={titulo.id}
                    onChange={() => setTituloSeleccionado(titulo)}
                  />
                  {titulo.titulo} - {titulo.fecha}
                </label>
              </li>
            ))}
          </ul>

          <button className="danger-button" onClick={handleEliminarLog} disabled={cargando}>
            {cargando ? 'Eliminando...' : 'Eliminar Log'}
          </button>
        </div>
      )}
    </div>
  );
};

export default LogManager;
