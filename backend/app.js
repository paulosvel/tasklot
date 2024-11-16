const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, 
}));

app.use(express.json());

// Use user routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
