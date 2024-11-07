import React, { useState } from 'react';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from 'react-router-dom';
import "./App.css";

const LogManager = () => {
  const [empresa, setEmpresa] = useState('');
  const [titulos, setTitulos] = useState([]);
  const [tituloSeleccionado, setTituloSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [mostrarEdicion, setMostrarEdicion] = useState(false);
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
    setMensaje('');
    setMostrarEdicion(false);
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
        // Decodificar Base64
        const decodedData = atob(response.data.contenido); // Decodificamos el contenido
        setTitulo(response.data.titulo);
        setContenido(decodedData); // El contenido decodificado se establece aquí
        setMensaje('');
        setMostrarEdicion(true); 
      } else {
        setMensaje('No se encontró el contenido del log.');
        setMostrarEdicion(false);
      }
    } catch (error) {
      console.error(error);
      setMensaje('Error al obtener el contenido del log.');
      setMostrarEdicion(false);
    } finally {
      setCargando(false);
    }
  };

  const handleActualizarLog = async () => {
    if (!tituloSeleccionado) {
      setMensaje('Por favor, selecciona un log para actualizar.');
      return;
    }
    setMostrarEdicion(true);
    handleObtenerContenidoLog(tituloSeleccionado);
  };

  const handleGuardarLog = async () => {
    if (!titulo || !contenido) {
      setMensaje('Por favor, completa ambos campos (título y contenido).');
      return;
    }

    try {
      setCargando(true);

      // Codificar el contenido en Base64
      const encodedContent = btoa(contenido); // Codificar en Base64

      const response = await axios.post('https://flask-five-jade.vercel.app/modificar-log', {
        empresa,
        id_log: tituloSeleccionado, 
        nuevoTitulo: titulo,
        nuevoContenido: encodedContent // Enviar el contenido codificado en Base64
      });

      if (response.data && response.data.message === 'Logs modificados correctamente') {
        setMensaje('Log actualizado correctamente.');
        handleBuscarLogs(); 
        setMostrarEdicion(false);
        setTitulo(''); 
        setContenido('');
      } else {
        setMensaje('Error al actualizar el log.');
      }
    } catch (error) {
      console.error(error);
      setMensaje('Error al guardar el log. Inténtalo de nuevo.');
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

      {mostrarEdicion && tituloSeleccionado && contenido && (
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
              apiKey="7a1g5nuzi6ya3heq0tir17f9lxstt7xlljnlavx1agc1n70n"
              value={contenido} // El contenido recibido se pasa aquí
              onEditorChange={(newValue) => setContenido(newValue)} 
              init={{
                height: 500,
                menubar: true,
                plugins: ['lists', 'link', 'image', 'table', 'textcolor', 'fontsize', 'autosave', 'autoresize'],
                toolbar: 'undo redo | formatselect | bold italic | fontselect | fontsize | forecolor | backcolor | alignleft aligncenter alignright | outdent indent | bullist numlist | link image',
                fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
                autoresize: {
                  enabled: true,
                  min_height: 200,
                  max_height: 1000,
                },
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
      
      <img
        src="https://cdn-icons-png.flaticon.com/512/0/340.png"
        alt="Volver"
        className="redirect-icon"
        onClick={() => navigate('/')}
        style={{ cursor: "pointer", width: "50px", height: "50px" }} 
      />
    </div>
  );
};

export default LogManager;
