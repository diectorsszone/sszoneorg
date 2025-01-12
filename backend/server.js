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
  time: { type: Date, default: Date.now },
  message: String,
  subject: String,
});

// Create a model
const FormData = mongoose.model('FormData', formDataSchema);



// POST route to save form data
app.post('/submit-form', async (req, res) => {
  const { name, email, address, number, time, message, subject } = req.body;

  try {
    const newFormData = new FormData({
      name,
      email,
      address,
      number,
      time,
      message,
      subject,
    });
    await newFormData.save();
    res.redirect('/thank-you'); // Redirect after successful form submission
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Route to thank user after form submission
app.get('/thank-you', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Thank You</title>
        <style>
          body {
            text-align: center;
            margin-top: 20%;
            font-family: Arial, sans-serif;
          }
          h3 {
            color: #333;
          }
          button {
            padding: 10px 20px;
            font-size: 16px;
            background-color: green; /* Button ka color green */
            color: white; /* Text ka color white */
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          button:hover {
            background-color: #005700; /* Hover karne par dark green */
          }
        </style>
      </head>
      <body style="text-align: center; margin-top: 20%;">
        <h1>हम से संपर्क करने के लिए आपका धन्यबाद ! <br> हम जल्द ही आप से संपर्क करेंगे ☺️☺️☺️</h1>
        <button onclick="redirectToHome()" style="padding: 10px 20px; font-size: 50px;" >
          OK
        </button>

        <script>
          function redirectToHome() {
            window.location.href = "https://www.groupofsszone.org";
          }
        </script>
      </body>
    </html>
  `);
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
