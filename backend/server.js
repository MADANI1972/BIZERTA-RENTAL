const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ message: 'Bizerta_Rental API is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur Bizerta_Rental sur le port ${PORT}`);
});
