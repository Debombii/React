import React, { useState } from 'react';
import './App.css';

const ChangelogGenerator = () => {
  const [description, setDescription] = useState('');
  const [newFeatures, setNewFeatures] = useState('');
  const [versionNotes, setVersionNotes] = useState('');
  const [company, setCompany] = useState('GERP');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  const [isHovered, setIsHovered] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');

  const companyStyles = {
    MRG: {
      color: '#07b3b3',
      iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzeClMWAdH73ZBmOkYRx_U-dyRu_ifleD1Fg&s'
    },
    GERP: {
      color: '#c50000',
      iconUrl: 'https://gerp-software.es/wp-content/uploads/2022/02/logo_gerp_sinso.png'
    },
    Rubicon: {
      color: '#0c0844',
      iconUrl: 'https://www.rubiconsulting.es/wp-content/uploads/2019/08/Logo2-01.png'
    }
  };

  const escapeHtml = (html) => {
    return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const unescapeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const extractContent = (html) => {
    const contentMatch = html.match(/<div class='version'>([\s\S]*?)<\/div>/);
    if (contentMatch) {
        return contentMatch[0];
    }
    return '';
  };

  const generateVersion = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Mes en formato MM
    const year = String(today.getFullYear()).slice(-2); // Últimos dos dígitos del año
    const randomNumbers = String(Math.floor(Math.random() * 1000)).padStart(3, '0'); // Tres números aleatorios
    return `${month}${year}-${randomNumbers}`;
  };

  const generateHtml = () => {
    const { color } = companyStyles[company] || companyStyles['MRG'];
    const version = generateVersion(); // Generar versión automáticamente

    const html = `
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>${version}</title>
        <style>
        :root {
              --main-bg-color: #f4f4f4;
              --main-text-color: #333;
              --highlight-color: ${color};
              --light-text-color: #777;
              --border-color: #ddd;
              --box-shadow-color: rgba(0, 0, 0, 0.1);
              --container-max-width: 1200px;
              --index-width: 250px;
          }
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              background-color: var(--main-bg-color);
              color: var(--main-text-color);
              line-height: 1.6;
          }
          .header {
              display: flex;
              justify-content: right;
              padding: 20px;
              box-shadow: 0 2px 4px var(--box-shadow-color);
          }
          .container {
              display: flex;
              flex-direction: row;
              max-width: var(--container-max-width);
              margin: 0 auto;
              padding: 20px;
              background-color: var(--main-bg-color);
          }
          .content {
              flex: 1;
              margin-right: 30px;
          }
          h1 {
              text-align: center;
              color: ${color};
              margin-bottom: 30px;
          }
          .version {
              margin-bottom: 40px;
              padding: 20px;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0 2px 4px var(--box-shadow-color);
          }
          .version h2 {
              color: ${color};
              border-bottom: 2px solid ${color};
              padding-bottom: 5px;
              font-size: 1.5rem;
          }
          .version .date {
              font-size: 0.9rem;
              color: var(--light-text-color);
              margin-bottom: 15px;
          }
          .version ul {
              list-style-type: disc;
              padding-left: 20px;
          }
          .version ul li {
              margin: 8px 0;
          }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='content'>
                <div class='version'>
                    <h2 id="${version.trim().replace(/\s+/g, '-')}">${version}</h2>
                    <p class='date' id="date">${new Date().toLocaleDateString('es-ES')}</p>
                    <h3>Descripción</h3>
                    ${description}
                    <h3>Nuevas funcionalidades</h3>
                    <ul>
                        ${newFeatures.split('\n').map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <h3 style='color: ${color};'>Notas de la Versión</h3>
                    <p>${versionNotes}</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    setGeneratedHtml(html);
    setBodyContent(unescapeHtml(extractContent(html)));
    
    // Guarda la empresa seleccionada
    setSelectedCompany(company);
  };

  const sendJson = () => {
    const jsonPayload = {
        company: selectedCompany,  // Empresa seleccionada
        bodyContent: bodyContent   // Contenido HTML generado
    };

    fetch('https://flask-nine-theta.vercel.app/upload-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonPayload),  // Enviar el JSON
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error('Error al enviar el JSON:', error);
    });
};

  return (
    <div>
      <header className="header">
        <img src="https://www.rubiconsulting.es/wp-content/uploads/2019/08/Logo2-01.png" alt="Logotipo del generador" />
        <h1 className="title">Generador de Log de Cambios</h1>
      </header>
      <div className="container">
        <h1 className="title">Generador de Log de Cambios</h1>
        <form onSubmit={(e) => { e.preventDefault(); generateHtml(); }} className="form">
          <label className="label">
            Fecha:
            <input type="date" value={new Date().toISOString().split('T')[0]} readOnly className="input" />
          </label>
          <label className="label">
            Empresa:
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)} // Solo actualiza el estado de la empresa
              required
              className="input2"
            >
              <option value="MRG">MRG</option>
              <option value="GERP">GERP</option>
              <option value="Rubicon">Rubicon</option>
            </select>
          </label>
          <label className="label">
            Descripción (HTML):
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="textarea"></textarea>
          </label>
          <label className="label">
            Nuevas Funcionalidades (una por línea):
            <textarea value={newFeatures} onChange={(e) => setNewFeatures(e.target.value)} required className="textarea"></textarea>
          </label>
          <label className="label">
            Notas de la versión:
            <textarea value={versionNotes} onChange={(e) => setVersionNotes(e.target.value)} required className="textarea"></textarea>
          </label>
          <div className="button-container">
            <button
              type="submit"
              className={`button ${isHovered === 'generate' ? 'button-hover' : ''}`}
              onMouseEnter={() => setIsHovered('generate')}
              onMouseLeave={() => setIsHovered('')}
            >
              Generar HTML
            </button>
          </div>
        </form>
        {generatedHtml && (
          <div className="generated-html">
            <h2 className="generated-title">HTML Generado:</h2>
            <textarea className="generated-textarea" readOnly value={generatedHtml} />
            <h2 className="generated-title">Código Fuente del Body:</h2>
            <textarea className="body-source-textarea" readOnly value={bodyContent} />
            <div className="button-container">
              <button
                onClick={sendJson}
                className={`download-button ${isHovered === 'download' ? 'download-button-hover' : ''}`}
                onMouseEnter={() => setIsHovered('download')}
                onMouseLeave={() => setIsHovered('')}
              >
                Enviar JSON
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangelogGenerator;
