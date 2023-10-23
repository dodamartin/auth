const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(express.json());

const routes = require('./routes'); // Import your routes module

app.use('/api', routes); // Use the routes module under /api

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
