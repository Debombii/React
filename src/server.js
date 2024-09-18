const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 5000;

// Configuración de multer para manejar la subida de archivos
const upload = multer({ dest: 'uploads/' });

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cargar las credenciales de la cuenta de servicio
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials.json'),
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

// Variable global para almacenar la empresa
let selectedCompany = '';

// Función para eliminar un archivo en Google Drive
async function deleteFile(fileId) {
  try {
    await drive.files.delete({ fileId });
    console.log(`Archivo con ID ${fileId} eliminado`);
  } catch (error) {
    console.error(`Error al eliminar el archivo con ID ${fileId}:`, error.message);
  }
}

// Función para buscar un archivo por nombre en Google Drive
async function findFileIdByName(fileName) {
  try {
    const res = await drive.files.list({
      q: `name='${fileName}' and mimeType='text/html'`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    const files = res.data.files;
    if (files.length > 0) {
      return files[0].id; // Retorna el ID del primer archivo encontrado
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al buscar el archivo:', error.message);
    return null;
  }
}

// Endpoint para recibir la compañía
app.post('/api/send-company', (req, res) => {
  const { company } = req.body;
  console.log('Compañía recibida:', company);
  selectedCompany = company; // Almacena la empresa en la variable global
  res.json({ message: 'Compañía recibida' });
});

// Endpoint para subir el archivo a Google Drive
app.post('/upload-file', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;

  try {
    // Verificar si ya existe un archivo llamado changelog.html y eliminarlo si es necesario
    const existingFileId = await findFileIdByName('changelog.html');
    if (existingFileId) {
      await deleteFile(existingFileId);
    }

    const fileMetadata = {
      name: 'changelog.html',
      parents: ['1_ss3rYceeMH9pEmWi17-31N3gi_nFpuw'] // Reemplaza con tu FOLDER_ID en Google Drive
    };
    const media = {
      mimeType: 'text/html',
      body: fs.createReadStream(filePath)
    };

    // Subida del archivo a Google Drive
    const driveResponse = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });

    console.log('Archivo subido a Google Drive con ID:', driveResponse.data.id);

    // Eliminación del archivo local
    fs.unlinkSync(filePath);

    // Llamar al script Python después de subir el archivo
    exec(`python ./htmlfinal.py ${selectedCompany}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error ejecutando el script Python: ${error.message}`);
        return res.status(500).send('Error al ejecutar el script Python');
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(500).send('Error en el script Python');
      }
      console.log(`stdout: ${stdout}`);
      res.send('Script Python ejecutado exitosamente');
    });
  } catch (error) {
    console.error('Error en el endpoint de subida de archivo:', error.message);
    res.status(500).send('Error al subir el archivo');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
