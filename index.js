// src/index.js

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const GifEncoder = require('gifencoder');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Ensure this path is correct and relative to your project root
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Basic user login (hardcoded)
const users = { user: 'password' };
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] === password) {
    return res.json({ message: 'Login successful' });
  }
  res.status(401).send('Unauthorized');
});

app.post('/resize', upload.single('image'), async (req, res) => {
  if (!req.file) {
    console.log('No file received');
    return res.status(400).send('No file uploaded.');
  }

  try {
    const filePath = path.join(__dirname, '/uploads', req.file.filename);
    console.log('File path:', filePath);  // Log the file path to confirm it's correct

    // Check if the file exists before attempting to resize
    if (!fs.existsSync(filePath)) {
      console.log('File not found:', filePath);
      return res.status(400).send('File not found.');
    }

    const resizedPath = filePath.replace(/(\.[\w\d_-]+)$/i, '_resized$1');

    await sharp(filePath)
      .resize({ width: 300, height: 300, fit: 'contain' })
      .toFile(resizedPath);
    res.json({ message: 'Image resized', path: resizedPath });
  } catch (err) {
    console.error('Error processing image:', err);
    res.status(500).send(`Error processing image: ${err.message}`);
  }
});
// GIF generation route
app.post('/create-gif', upload.array('images', 5), async (req, res) => {
  try {
    const encoder = new GifEncoder(300, 300);
    const gifPath = path.join(__dirname, '..', 'uploads', `${Date.now()}.gif`);
    const gifStream = fs.createWriteStream(gifPath);

    encoder.createReadStream().pipe(gifStream);
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(500);
    encoder.setQuality(10);

    for (let file of req.files) {
      const image = await Jimp.read(file.path);
      encoder.addFrame(image.bitmap.data);
    }

    encoder.finish();
    gifStream.on('close', () => res.json({ message: 'GIF created', path: gifPath }));
  } catch (err) {
    res.status(500).send('Error creating GIF.');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
