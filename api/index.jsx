const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = 8000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://imabhishek028:imabhishek028@cluster0.yjpyfbo.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to mongoDB");
  }).catch((error) => {
    console.log(error);
  });

app.listen(port, () => {
  console.log(`Server running on Port ${port}`);
});

const User = require('./models/user.jsx');
const Order = require('./models/order.jsx');

const generateSecretKey = () => {
  const secret = crypto.randomBytes(32).toString("hex");
  return secret;
}

const secretKey = generateSecretKey();

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "imabhishek028@gmail.com",
      pass: "gunq jmln msmz egto" 
    }
  });

  const mailOptions = {
    from: "bookhub.com <imabhishek028@gmail.com>",
    to: email,
    subject: 'Email Verification',
    text: `Please Click on the link to verify your email: http://192.168.52.122:8000/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent');
  } catch (error) {
    console.log(`Error sending mail: ${error}`);
  }
};

// Endpoint to register
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User is already Registered" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(200).json({ message: "User registered successfully. Verification email sent." });
  } catch (error) {
    console.log(`Error registering: ${error}`);
    res.status(500).json({ message: "Error Registering" });
  }
});

// Endpoint to login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const isPasswordCorrect = user.password === password;
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }


    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '2h' });
    res.status(200).json({ message: "Login Successful", token });

  } catch (error) {
    console.log(`Error logging in: ${error}`);
    res.status(500).json({ message: "Error logging in" });
  }
});
