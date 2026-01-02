const express = require('express');
const cors = require('cors');

const app = express();

// This lets your server understand JSON data
app.use(cors());
app.use(express.json());

// Your first route - when someone visits your website
app.get('/', (req, res) => {
  res.json({ 
    message: '🎉 Your Scan & Go server is working!',
    status: 'online'
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log('👉 Open this URL in your browser!');
});