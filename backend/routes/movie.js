const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/movie', async (req, res) => {
    const { title } = req.body;
    const { OMDB_API_KEY, GEMINI_API_KEY } = process.env;

    if (!title) {
        return res.status(400).json({ message: 'Movie title is required' });
    }

    try {
        const omdbUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`;
        const omdbResponse = await axios.get(omdbUrl);

        if (omdbResponse.data.Response === 'False') {
            return res.status(404).json({ message: 'Movie not found.' });
        }

        const movieData = omdbResponse.data;
        const plot = movieData.Plot;
        let aiSummary = 'AI summary could not be generated for this movie.';

        if (plot && plot !== 'N/A' && GEMINI_API_KEY) {
            try {
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;                
                const requestBody = {
                    contents: [{
                        parts: [{
                            text: `Summarize this movie plot in one short and engaging sentence: "${plot}"`
                        }]
                    }]
                };

                const geminiResponse = await axios.post(geminiUrl, requestBody, {
                    headers: { 'Content-Type': 'application/json' }
                });

                if (geminiResponse.data.candidates && geminiResponse.data.candidates.length > 0) {
                    aiSummary = geminiResponse.data.candidates[0].content.parts[0].text.trim();
                }

            } catch (aiError) {
                console.error('Gemini API Error:', aiError.response ? aiError.response.data.error : aiError.message);
            }
        }
        
        res.json({ ...movieData, aiSummary });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'An error occurred while fetching movie data.' });
    }
});

module.exports = router;