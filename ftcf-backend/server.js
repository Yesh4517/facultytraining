const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

dotenv.config();

// Force Google DNS — fixes SRV lookup failures on some networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://yesh4517.github.io',
    /\.vercel\.app$/,
    /\.onrender\.com$/,
  ],
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',           require('./routes/auth'));
app.use('/api/users',          require('./routes/users'));
app.use('/api/trainings',      require('./routes/trainings'));
app.use('/api/registrations',  require('./routes/registrations'));
app.use('/api/certificates',   require('./routes/certificates'));
app.use('/api/credits',        require('./routes/credits'));
app.use('/api/attendance',     require('./routes/attendance'));
app.use('/api/stats',          require('./routes/stats'));

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'OK', time: new Date() }));

// ── Connect & Listen ────────────────────────────────────────────────────────
// Render assigns PORT dynamically — must listen on 0.0.0.0
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀  Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });
