const express = require('express');
const { generateQuestion } = require('../controllers/generateController');

const router = express.Router();

router.get('/generate', generateQuestion);

module.exports = router;
