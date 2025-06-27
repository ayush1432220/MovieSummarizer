const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const movieRoutes = require('./routes/movie');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://movie-summarizer-eg6r.vercel.app', // ✅ Replace with your deployed frontend domain
  'https://moviesummarizer.onrender.com'             // ✅ Local dev support
];

app.use(cors({
  origin:  function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use('/api', movieRoutes);

function getAISummary(plot) {
  if (!plot || plot === "N/A") {
    return "No plot available to generate a summary.";
  }
  const summary = `${plot.split('.')[0]}.`;
  return `${summary} (AI Interpreted)`;
}

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
