const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes
app.post('/upload', upload.single('document'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

app.post('/analyze/pdf', upload.single('document'), (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  const dataBuffer = fs.readFileSync(filePath);
  pdfParse(dataBuffer)
    .then(data => {
      res.json({ text: data.text });
    })
    .catch(err => {
      res.status(500).send('Error processing PDF file.');
    });
});

app.post('/analyze/docx', upload.single('document'), (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  mammoth.extractRawText({ path: filePath })
    .then(result => {
      res.json({ text: result.value });
    })
    .catch(err => {
      res.status(500).send('Error processing Word file.');
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
