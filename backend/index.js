require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize the app
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URL;

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Directory for EJS files

app.use(cors({
  origin: 'http://localhost:5173', // Vite frontend ka URL
  methods: ['POST', 'GET'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To handle form submissions

// Define a schema
const formDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  number: Number,
  time: { type: Date, default: Date.now }
});

// Create a model
const FormData = mongoose.model('FormData', formDataSchema);



// POST route to save form data
app.post('/submit-form', async (req, res) => {
  const { name, email, address, number, time } = req.body;

  try {
    const newFormData = new FormData({
      name,
      email,
      address,
      number,
      time,
    });
    await newFormData.save();
    res.redirect('/thank-you'); // Redirect after successful form submission
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Route to thank user after form submission
app.get('/thank-you', (req, res) => {
  res.send('Thank you for submitting the form!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
});
