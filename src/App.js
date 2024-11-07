import React, { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

const ChangelogGenerator = () => {
  const [description, setDescription] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [title, setTitle] = useState("");
  const [isHovered, setIsHovered] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const editorRef = useRef(null);
  const navigate = useNavigate();

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

  const cleanContent = (content) => {
    return content
      .replace(/<p><p>(.*?)<\/p><\/p>/g, '<p>$1</p>')
      .replace(/<p><\/p>/g, '');
  };

  const generateHtml = () => {
    const version = generateVersion();
    const cleanedDescription = cleanContent(description);
    
    const html = `
      <!DOCTYPE html>
      <html lang='es'>
      <head>
          <meta charset='UTF-8'>
          <meta name='viewport' content='width=device-width, initial-scale=1.0'>
          <title>${version}</title>
          <style>
          </style>
      </head>
      <body>
          <div class='container'>
              <div class='content'>
                  <div class='version'>
                      <h2 class="base" id="${version.trim().replace(/\s+/g, "-")}">${version}</h2>
                      <p class='date' id="date">${new Date().toLocaleDateString("es-ES")}</p>
                      <h3 class="titular" id="${title}">${title}</h3>
                      <h3 class="titular">Contenido</h3>
                      <div class="description-content">
                        ${cleanedDescription}
                      </div>
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
        <div className="icon-container">
          <img
            src="https://cdn-icons-png.flaticon.com/512/25/25008.png"
            alt="Eliminar Logs"
            className="redirect-icon"
            style={{ cursor: "pointer", width: "50px", height: "50px" }}
            onClick={() => navigate("/logs")}
          />
          
          <Link to="/modifyLogs">
            <img
              src="https://icons.veryicon.com/png/o/miscellaneous/currency/update-12.png"
              alt="Modificar Logs"
              className="redirect-icon"
              style={{ cursor: "pointer", width: "50px", height: "50px", marginLeft: "10px" }}
            />
          </Link>
        </div>

        <h1 className="title">Generador de Log de Cambios</h1>
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
              {["MRG", "OCC", "Godiz", "GERP", "Rubicon"].map((company) => (
                <label key={company}>
                  <input
                    type="checkbox"
                    value={company}
                    checked={selectedCompanies.includes(company)}
                    onChange={handleCompanyChange}
                  />
                  <div className="custom-checkbox"></div>
                  {company}
                </label>
              ))}
            </div>
          </label>
          <label className="label">
            Contenido:
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
                  "autosave",
                  "fontsize",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | fontsize | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help | \
                  forecolor backcolor | link image",
                fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                autoresize: {
                  enabled: true,
                  min_height: 200, 
                  max_height: 600, 
                },
                autoresize_bottom_margin: 10, 
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
              Generar Log
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
                type="button"
                className={`button ${isHovered === "send" ? "button-hover" : ""}`}
                onMouseEnter={() => setIsHovered("send")}
                onMouseLeave={() => setIsHovered("")}
                onClick={sendJson}
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar JSON"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangelogGenerator;
