import React, { useState } from 'react';
import "./App.css";
import axios from 'axios';

const LogManager = () => {
  const [empresa, setEmpresa] = useState('');
  const [titulos, setTitulos] = useState([]);
  const [tituloSeleccionado, setTituloSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const empresas = ['MRG', 'Rubicon', 'GERP', 'Godiz', 'OCC'];

  const handleBuscarLogs = async () => {
    if (!empresa) {
      setMensaje('Por favor, selecciona una empresa.');
      return;
    }

    try {
      const response = await axios.post('https://flask-five-jade.vercel.app/listar-titulos', { empresa });
      setTitulos(response.data.titulos);
      setMensaje('');
    } catch (error) {
      setMensaje('Error al buscar los logs. Inténtalo de nuevo.');
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
      await axios.post('https://flask-five-jade.vercel.app/eliminar-log', { empresa, titulo: tituloSeleccionado.titulo });
      setMensaje('Log eliminado exitosamente.');
      setTitulos(titulos.filter(titulo => titulo.id !== tituloSeleccionado.id)); // Filtramos por id
      setTituloSeleccionado(null); // Reiniciar selección
    } catch (error) {
      setMensaje('Error al eliminar el log. Inténtalo de nuevo.');
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
        >
          <option value="">Seleccionar empresa</option>
          {empresas.map((empresa) => (
            <option key={empresa} value={empresa}>{empresa}</option>
          ))}
        </select>
        <button onClick={handleBuscarLogs}>Buscar</button>
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
                    onChange={() => setTituloSeleccionado(titulo)} // Guardamos el objeto completo
                  />
                  {titulo.titulo} - {titulo.fecha} {/* Mostrar título y fecha */}
                </label>
              </li>
            ))}
          </ul>

          <button className="danger-button" onClick={handleEliminarLog}>Eliminar Log</button>
        </div>
      )}
    </div>
  );
};

export default LogManager;
