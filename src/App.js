import React, { useState } from "react";
import "./App.css";
import { Editor } from "@tinymce/tinymce-react";

const ChangelogGenerator = () => {
  const [description, setDescription] = useState("");
  const [newFeatures, setNewFeatures] = useState("");
  const [solvedErrors, setSolvedErrors] = useState("");
  const [versionNotes, setVersionNotes] = useState("");
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
    const randomNumbers = String(Math.floor(Math.random() * 1000)).padStart(
      4,
      "0"
    );
    return `${month}${year}-${randomNumbers}`;
  };

 const generateHtml = () => {
    const version = generateVersion();

    const cleanContent = (content) => {
        // Reemplaza <p><p> y </p></p> anidados, dejando solo un nivel de <p>
        return content
            .replace(/<p><p>(.*?)<\/p><\/p>/g, '<p>$1</p>') // Reemplaza <p><p>...</p></p>
            .replace(/<p><\/p>/g, ''); // Elimina párrafos vacíos
    };

    const processedNewFeatures = cleanContent(newFeatures
        .split("\n")
        .map((feature) => feature.trim())
        .filter((feature) => feature.length > 0)
        .map((feature) => `<p>${feature}</p>`) // Cambiar a párrafos
        .join(""));

    const processedSolvedErrors = cleanContent(solvedErrors
        .split("\n")
        .map((error) => error.trim())
        .filter((error) => error.length > 0)
        .map((error) => `<p>${error}</p>`) // Cambiar a párrafos
        .join(""));

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
                      <h2 id="${version.trim().replace(/\s+/g, "-")}">${version}</h2>
                      <p class='date' id="date">${new Date().toLocaleDateString("es-ES")}</p>
                      <h3 class="titulo" id="${title}">${title}</h3>
                      <h3>Descripción</h3>
                      ${description}
                      <h3>Nuevas funcionalidades</h3>
                      ${processedNewFeatures}
                      <h3>Errores Solucionados</h3>
                      ${processedSolvedErrors}
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
                <div className="custom-checkbox"></div>
                MRG
              </label>
              <label>
                <input
                  type="checkbox"
                  value="OCC"
                  checked={selectedCompanies.includes("OCC")}
                  onChange={handleCompanyChange}
                />
                <div className="custom-checkbox"></div>
                OCC
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
            Nuevas Funcionalidades:
            <Editor
              apiKey="7a1g5nuzi6ya3heq0tir17f9lxstt7xlljnlavx1agc1n70n"
              value={newFeatures}
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
              onEditorChange={(newValue) => setNewFeatures(newValue)}
              required
            />
          </label>
          <label className="label">
            Errores Solucionados:
            <Editor
              apiKey="7a1g5nuzi6ya3heq0tir17f9lxstt7xlljnlavx1agc1n70n"
              value={solvedErrors}
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
              onEditorChange={(newValue) => setSolvedErrors(newValue)}
              required
            />
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
