const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000';
    
    // assuming python api accepts /upload
    const response = await axios.post(`${pythonApiUrl}/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error uploading file to python API:', error.message);
    // Provide a more graceful fallback data if python API is unavailable for testing UI
    res.status(500).json({ error: 'Failed to upload file to processing server' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000';
    
    const response = await axios.post(`${pythonApiUrl}/ask/`, { question });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error chatting with python API:', error.message);
    res.status(500).json({ error: 'Failed to communicate with AI server' });
  }
});

app.get('/api/summary', async (req, res) => {
  try {
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000';
    const response = await axios.get(`${pythonApiUrl}/summarize/`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching summary from python API:', error.message);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

app.get('/api/review', async (req, res) => {
  try {
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000';
    const response = await axios.get(`${pythonApiUrl}/literature-review/`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching review from python API:', error.message);
    res.status(500).json({ error: 'Failed to generate literature review' });
  }
});

app.get('/api/keypoints', async (req, res) => {
  try {
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000';
    const response = await axios.get(`${pythonApiUrl}/key-points/`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching key points from python API:', error.message);
    res.status(500).json({ error: 'Failed to extract key points' });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
