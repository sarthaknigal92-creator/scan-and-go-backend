const express = require('express');
const cors = require('cors');
const pool = require('./database');

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🎉 Your Scan & Go server is working!',
    status: 'online'
  });
});

// Test database route
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      success: true, 
      message: 'Database connected!',
      time: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, category, price, stock, reorderLevel, location } = req.body;
    const storeId = 1; // Using the demo store we created
    
    // Generate QR code
    const qrCode = `QR-${name.substring(0, 3).toUpperCase()}-${Date.now()}`;
    
    const result = await pool.query(
      'INSERT INTO products (store_id, name, category, price, stock, reorder_level, location, qr_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [storeId, name, category, price, stock, reorderLevel, location, qrCode]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});