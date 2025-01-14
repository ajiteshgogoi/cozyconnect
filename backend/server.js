const express = require('express');
const cors = require('cors');
const generateRoute = require('./routes/generate');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3001'
}));
app.use(express.json());

// Routes
app.use('/api', generateRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
