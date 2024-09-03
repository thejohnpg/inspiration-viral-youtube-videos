const express = require('express');
const { google } = require('googleapis');

const app = express();
const port = 3000;

require('dotenv').config();

const apiKey = process.env.YOUTUBE_API_KEY;
const youtube = google.youtube({
  version: 'v3',
  auth: apiKey
});

// Middleware para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Rota para buscar vídeos por nicho
app.get('/search', async (req, res) => {
  const niche = req.query.niche;
  try {
    console.log(`Buscando vídeos para o nicho: ${niche}`);

    // Search for videos
    const response = await youtube.search.list({
      q: niche,
      part: 'snippet', // Only request snippet for search
      type: 'video',
      order: 'viewCount',
      maxResults: 10
    });

    const videoIds = response.data.items.map(item => item.id.videoId);

    // Get details including statistics for each video ID
    const detailedVideos = await youtube.videos.list({
      id: videoIds.join(','), // Comma-separated list of video IDs
      part: 'snippet,statistics' // Request both snippet and statistics
    });

    const videos = detailedVideos.data.items.map(item => ({
      title: item.snippet.title,
      description: item.snippet.description,
      viewCount: item.statistics.viewCount,
      channelTitle: item.snippet.channelTitle,
      likeCount: item.statistics?.likeCount,
      videoId: item.id.videoId,
      thumbnail: item.snippet.thumbnails.default.url,
      url: `https://www.youtube.com/watch?v=${item.id}`,
    }));

    res.json(videos);
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    // ... (handle errors)
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});