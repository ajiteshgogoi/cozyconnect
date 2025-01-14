const express = require('express');
const { generateQuestion } = require('../controllers/generateController');

const router = express.Router();

router.get('/generate', generateQuestion);
router.post('/generate', generateQuestion);

module.exports = router;
