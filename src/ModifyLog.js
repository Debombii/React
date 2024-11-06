import React, { useState, useRef } from 'react';
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
  const [description, setDescription] = useState('');
  const editorRef = useRef(null);

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
    const logSeleccionado = titulos.find(titulo => titulo.id === id);
    if (logSeleccionado) {
      setDescription(logSeleccionado.contenido);
    }
  };

  const handleActualizarLog = async () => {
    if (!tituloSeleccionado) {
      setMensaje('Por favor, selecciona un log para actualizar.');
      return;
    }

    try {
      setCargando(true);
      const response = await axios.post('https://flask-five-jade.vercel.app/actualizar-log', {
        empresa,
        id: tituloSeleccionado,
        contenido: description
      });

      if (response.data.success) {
        setMensaje('Log actualizado exitosamente.');
      } else {
        setMensaje('Error al actualizar el log. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error(error);
      setMensaje('Error al actualizar el log. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const handleRedirect = () => {
    navigate('/');
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

          {tituloSeleccionado && (
            <div className="editor-container">
              <h3>Actualizar Log</h3>
              <label className="label">
                Contenido:
                <div className="editor-wrapper">
                  <Editor
                    apiKey="7a1g5nuzi6ya3heq0tir17f9lxstt7xlljnlavx1agc1n70n"
                    value={description}
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount",
                        "textcolor",
                        "autoresize",
                      ],
                      toolbar:
                        "undo redo | formatselect | bold italic backcolor | fontsize | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help",
                      fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                      autoresize_bottom_margin: 10,
                      autoresize_max_height: 600,
                    }}
                    onEditorChange={(newValue) => setDescription(newValue)}
                    required
                  />
                </div>
              </label>
              <button className="primary-button" onClick={handleActualizarLog} disabled={cargando}>
                {cargando ? 'Actualizando...' : 'Enviar Actualización'}
              </button>
            </div>
          )}
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
