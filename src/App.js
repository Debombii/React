import React, { useState, useEffect } from "react";
import "./App.css"; // Asegúrate de que el CSS esté incluido aquí
import { Editor } from "@tinymce/tinymce-react";

const ChangelogGenerator = () => {
  const [description, setDescription] = useState("");
  const [newFeatures, setNewFeatures] = useState("");
  const [solvedErrors, setSolvedErrors] = useState("");
  const [versionNotes, setVersionNotes] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [isHovered, setIsHovered] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.tiny.cloud/1/no-api-key/tinymce/7/tinymce.min.js";
    script.referrerPolicy = "origin";
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

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
    const randomNumbers = String(Math.floor(Math.random() * 1000)).padStart(
      4,
      "0"
    );
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
        <style>
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='content'>
                <div class='version'>
                    <h2 id="${version
                      .trim()
                      .replace(/\s+/g, "-")}">${version}</h2>
                    <p class='date' id="date">${new Date().toLocaleDateString(
                      "es-ES"
                    )}</p>
                    <h3>Descripción</h3>
                    ${description}
                    <h3>Nuevas funcionalidades</h3>
                    <ul>
                        ${newFeatures
                          .split("\n")
                          .map((feature) => `<li>${feature}</li>`)
                          .join("")}
                    </ul>
                    <h3>Errores Solucionados</h3>
                    <ul>
                        ${solvedErrors
                          .split("\n")
                          .map((error) => `<li>${error}</li>`)
                          .join("")}
                    </ul>
                    <h3 class="Maincolor">Notas de la Versión</h3>
                    <p>${versionNotes}</p>
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
              readOnly
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
                <div className="custom-checkbox"></div>
                MRG
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Godiz"
                  checked={selectedCompanies.includes("Godiz")}
                  onChange={handleCompanyChange}
                />
                <div className="custom-checkbox"></div>
                Godiz
              </label>
              <label>
                <input
                  type="checkbox"
                  value="GERP"
                  checked={selectedCompanies.includes("GERP")}
                  onChange={handleCompanyChange}
                />
                <div className="custom-checkbox"></div>
                GERP
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Rubicon"
                  checked={selectedCompanies.includes("Rubicon")}
                  onChange={handleCompanyChange}
                />
                <div className="custom-checkbox"></div>
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
          <label className="label">
            Nuevas Funcionalidades (una por línea):
            <textarea
              value={newFeatures}
              onChange={(e) => setNewFeatures(e.target.value)}
              required
              className="textarea"
            ></textarea>
          </label>
          <label className="label">
            Errores Solucionados (uno por línea):
            <textarea
              value={solvedErrors}
              onChange={(e) => setSolvedErrors(e.target.value)}
              required
              className="textarea"
            ></textarea>
          </label>
          <label className="label">
            Notas de la versión:
            <textarea
              value={versionNotes}
              onChange={(e) => setVersionNotes(e.target.value)}
              required
              className="textarea"
            ></textarea>
          </label>
          <div className="button-container">
            <button
              type="submit"
              className={`button ${
                isHovered === "generate" ? "button-hover" : ""
              }`}
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
                className={`download-button ${
                  isHovered === "download" ? "download-button-hover" : ""
                }`}
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
