const express = require('express');
const { generateQuestion, generateImage } = require('../controllers/generateController');

const router = express.Router();

router.get('/generate', generateQuestion);
router.post('/generate', generateQuestion);
router.get('/generate/image', generateImage);

module.exports = router;
