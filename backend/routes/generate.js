const express = require('express');
const { generateQuestion } = require('../controllers/generateController');

const router = express.Router();

router.get('/generate', generateQuestion);
router.post('/generate', generateQuestion);
router.get('/generate/image', (req, res) => {
  const { title, description } = req.query;
  if (!title || !description) {
    return res.status(400).json({
      type: 'error',
      message: 'Both title and description are required',
      code: 'MISSING_PARAMETERS'
    });
  }
  
  // Proxy request to Edge Runtime endpoint
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://cozyconnect.vercel.app/api/og'
    : 'http://localhost:3000/api/og';
  const url = new URL(baseUrl);
  url.searchParams.set('title', title);
  url.searchParams.set('description', description);
  
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Image generation failed');
      return response.arrayBuffer();
    })
    .then(buffer => {
      res.set('Content-Type', 'image/png');
      res.send(Buffer.from(buffer));
    })
    .catch(error => {
      console.error('Error generating image:', error);
      res.status(500).json({
        type: 'error',
        message: 'Failed to generate image',
        code: 'IMAGE_GENERATION_ERROR'
      });
    });
});

module.exports = router;
