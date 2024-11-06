import React, { useState } from 'react'; 
import "./App.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';

const LogManager = () => {
  const [empresa, setEmpresa] = useState('');
  const [titulos, setTitulos] = useState([]);
  const [tituloSeleccionado, setTituloSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
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

  const handleSeleccionarLog = (id) => {
    setTituloSeleccionado(id); 
    setMensaje('');  // Limpiar mensaje si se selecciona un log
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
        // Establecemos el título y el contenido para ser editados
        setTitulo(response.data.titulo);
        setContenido(response.data.contenido);
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
    handleObtenerContenidoLog(tituloSeleccionado);
  };

  const handleGuardarLog = async () => {
    if (!titulo || !contenido) {
      setMensaje('Por favor, completa ambos campos (título y contenido).');
      return;
    }
    // Aquí se puede enviar el log actualizado al backend para guardarlo
    setMensaje('Log actualizado correctamente.');
    console.log('Log actualizado:', { titulo, contenido });
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
                    type="radio" 
                    name="titulo"
                    value={titulo.id}
                    checked={tituloSeleccionado === titulo.id}
                    onChange={() => handleSeleccionarLog(titulo.id)}
                  />
                  {titulo.titulo} - {titulo.fecha}
                </label>
              </li>
            ))}
          </ul>

          <div className="button-container">
            <button className="danger-button" onClick={handleActualizarLog} disabled={cargando || !tituloSeleccionado}>
              {cargando ? 'Cargando...' : 'Actualizar Log'}
            </button>
          </div>
        </div>
      )}
      {tituloSeleccionado && (
        <div className="edit-log-container">
          <h3>Editar Log</h3>
          <div>
            <label htmlFor="titulo">Título:</label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="contenido">Contenido:</label>
            <Editor
              apiKey="your-tinymce-api-key" // Si necesitas una API key, úsala aquí
              value={contenido}
              onEditorChange={(newValue) => setContenido(newValue)}
              init={{
                height: 500,
                menubar: false,
                plugins: ['lists', 'link', 'image', 'table'],
                toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | outdent indent | bullist numlist | link image',
              }}
            />
          </div>

          <div className="button-container">
            <button className="primary-button" onClick={handleGuardarLog}>
              Guardar Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogManager;
