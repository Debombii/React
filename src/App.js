import React, { useState } from "react";
import "./App.css";
import { Editor } from "@tinymce/tinymce-react";

const ChangelogGenerator = () => {
  const [description, setDescription] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [title, setTitle] = useState("");
  const [isHovered, setIsHovered] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    return "";
  };

  const generateVersion = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = String(today.getFullYear()).slice(-2);
    const randomNumbers = String(Math.floor(Math.random() * 1000)).padStart(4, "0");
    return `${month}${year}-${randomNumbers}`;
  };

  const generateHtml = () => {
    const version = generateVersion();

    const html = `
      <!DOCTYPE html>
      <html lang='es'>
      <head>
          <meta charset='UTF-8'>
          <meta name='viewport' content='width=device-width, initial-scale=1.0'>
          <title>${version}</title>
      </head>
      <body>
          <div class='container'>
              <div class='content'>
                  <div class='version'>
                      <h2 id="${version.trim().replace(/\s+/g, "-")}">${version}</h2>
                      <p class='date' id="date">${new Date().toLocaleDateString("es-ES")}</p>
                      <h3 class="titulo" id="${title}">${title}</h3>
                      <h3>Contenido</h3>
                      ${description}
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;

    setGeneratedHtml(html);
    setBodyContent(unescapeHtml(extractContent(html)));
  };

  const sendJson = () => {
    const jsonPayload = {
      companies: selectedCompanies,
      bodyContent: bodyContent,
    };

    setIsLoading(true);

    fetch("https://flask-five-jade.vercel.app/upload-file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonPayload),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error al enviar el JSON:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCompanyChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCompanies((prev) =>
      checked ? [...prev, value] : prev.filter((company) => company !== value)
    );
  };

  const handleRedirect = () => {
    window.location.href = '/logs'; // Redirige a /logs
  };

  return (
    <div>
      <header className="header">
        <img
          src="https://www.rubiconsulting.es/wp-content/uploads/2019/08/Logo2-01.png"
          alt="Logotipo del generador"
        />
        <h1 className="title">Generador de Log de Cambios</h1>
      </header>
      <div className="container">
        <img
          src="https://cdn-icons-png.flaticon.com/512/25/25008.png"
          alt="Eliminar Logs"
          className="redirect-icon"
          onClick={handleRedirect}
          style={{ cursor: "pointer", width: "50px", height: "50px" }}
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateHtml();
          }}
          className="form"
        >
          <label className="label">
            Fecha:
            <input
              type="date"
              value={new Date().toISOString().split("T")[0]}
              className="input"
            />
          </label>
          <label className="label">
            Título:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input"
            />
          </label>
          <label className="label">
            Proyectos:
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  value="MRG"
                  checked={selectedCompanies.includes("MRG")}
                  onChange={handleCompanyChange}
                />
                MRG
              </label>
              <label>
                <input
                  type="checkbox"
                  value="OCC"
                  checked={selectedCompanies.includes("OCC")}
                  onChange={handleCompanyChange}
                />
                OCC
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Godiz"
                  checked={selectedCompanies.includes("Godiz")}
                  onChange={handleCompanyChange}
                />
                Godiz
              </label>
              <label>
                <input
                  type="checkbox"
                  value="GERP"
                  checked={selectedCompanies.includes("GERP")}
                  onChange={handleCompanyChange}
                />
                GERP
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Rubicon"
                  checked={selectedCompanies.includes("Rubicon")}
                  onChange={handleCompanyChange}
                />
                Rubicon
              </label>
            </div>
          </label>
          <label className="label">
            Descripción:
            <Editor
              apiKey="7a1g5nuzi6ya3heq0tir17f9lxstt7xlljnlavx1agc1n70n"
              value={description}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help",
              }}
              onEditorChange={(newValue) => setDescription(newValue)}
              required
            />
          </label>
          <div className="button-container">
            <button
              type="submit"
              className={`button ${isHovered === "generate" ? "button-hover" : ""}`}
              onMouseEnter={() => setIsHovered("generate")}
              onMouseLeave={() => setIsHovered("")}
            >
              Generar HTML
            </button>
          </div>
        </form>

        {generatedHtml && (
          <div className="generated-html">
            <h2 className="generated-title">HTML Generado:</h2>
            <textarea
              className="generated-textarea"
              readOnly
              value={generatedHtml}
            />
            <h2 className="generated-title">Código Fuente del Body:</h2>
            <textarea
              className="body-source-textarea"
              readOnly
              value={bodyContent}
            />
            <div className="button-container">
              <button
                onClick={sendJson}
                className={`download-button ${isHovered === "download" ? "download-button-hover" : ""}`}
                onMouseEnter={() => setIsHovered("download")}
                onMouseLeave={() => setIsHovered("")}
              >
                Enviar JSON
              </button>
            </div>
          </div>
        )}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-popup">
              <div className="loading-spinner"></div>
              <p>Cargando...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangelogGenerator;
