const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const cloudinary = require('../assets/utils/cloudinaryConfig.jsx');

const app = express();
const port = 8000;

app.use(cors({ credentials: true, origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(morgan('dev'));

mongoose.connect('mongodb+srv://imabhishek028:imabhishek028@cluster0.yjpyfbo.mongodb.net/')
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => console.log(error));

app.listen(port, () => console.log(`Server running on Port ${port}`));

const User = require('./models/user.jsx');

const generateSecretKey = () => crypto.randomBytes(32).toString("hex");
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
    text: `Please click on the link to verify your email: http://192.168.52.122:8000/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent');
  } catch (error) {
    console.log(`Error sending mail: ${error}`);
  }
};

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.query;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User is already registered" });

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(200).json({ message: "User registered successfully. Verification email sent." });
  } catch (error) {
    console.log('Error in the end', error.response || error.message || error);
    res.status(500).json({ message: "Error registering" });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordCorrect = user.password === password;
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '2h' });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.log(`Error logging in: ${error.response}`);
    res.status(500).json({ message: `Error logging in ${error}` });
  }
});

// Get user info endpoint
app.get('/userProfile', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const userInfo = await User.findOne({ email });
    if (!userInfo) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(userInfo);
  } catch (err) {
    console.error(`Error getting data: ${err.message}`);
    res.status(500).json({ message: "Error getting user info" });
  }
});

// Update user profile endpoint
app.post('/updateUserProfile', async (req, res) => {
  try {
    const { email, name, age, gender, phone, profilePicture } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${profilePicture}`, { folder: 'user_picture' });
    const imageUrl = result.secure_url;

    const userInfo = await User.findOne({ email });
    if (!userInfo) return res.status(404).json({ message: "User not found" });

    userInfo.name = name;
    userInfo.age = age;
    userInfo.gender = gender;
    userInfo.phone = phone;
    userInfo.profilePicture = imageUrl;
    await userInfo.save();

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(`Error updating data: ${err}`);
    res.status(500).json({ message: "Error updating user info" });
  }
});

// Add book to user endpoint
app.post('/createBook', async (req, res) => {
  try {
    const { email, createdBook } = req.body;
    const { title, author, genre, description, coverImage } = createdBook;

    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${coverImage}`,
      { folder: 'book_covers' });
    const imageUrl = result.secure_url;

    let book = await User.findOne({ email: email });
    if (!book) {
      book = new User({ email, createdBooks: [{ title, author, genre, description, coverImage: imageUrl }] });
    } else {
      book.createdBooks.push({ title, author, genre, description, coverImage: imageUrl });
    }
    await book.save();
    res.status(200).send({ message: "Book created!" });
  } catch (err) {
    console.error('Error saving book:', err);
    res.status(500).send({ err });
  }
});

// Get current collections endpoint
app.get('/getCurrentCollections', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    const createdBooks = user.createdBooks;
    return res.status(200).json(createdBooks);
  } catch (err) {
    console.error('Error getting collections:', err);
    res.status(500).send({ err });
  }
});

// Delete created book endpoint
app.delete('/deleteCreatedBook', async (req, res) => {
  const { email, item } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const bookIndex = user.createdBooks.findIndex((book) => book._id.toString() === item._id.toString());
    if (bookIndex !== -1) {
      user.createdBooks.splice(bookIndex, 1);
      await user.save();
      return res.status(200).json({ message: "Book deleted successfully" });
    } else {
      return res.status(400).json({ message: "Book not found" });
    }
  } catch (err) {
    console.error('Error deleting collection:', err);
    return res.status(500).send({ err });
  }
});

// Add book to favorites endpoint
app.post('/addToFav', async (req, res) => {
  try {
    const { email, bookId } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.favouriteBooks.push({ bookId });
    await user.save();
    res.status(200).json({ message: "Book added to favourites" });
  } catch (error) {
    console.error('Error adding to favourites:', error);
    res.status(500).json({ message: 'Error adding to favourites' });
  }
});

// Remove book from favorites endpoint
app.delete('/removeFromFav', async (req, res) => {
  try {
    const { email, bookId } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.favouriteBooks = user.favouriteBooks.filter(fav => fav.bookId !== bookId);
    await user.save();
    res.status(200).json({ message: "Book removed from favourites" });
  } catch (error) {
    console.error('Error removing from favourites:', error);
    res.status(500).json({ message: 'Error removing from favourites' });
  }
});

// Check if a book is in the favorites
app.get('/checkIfFav', async (req, res) => {
  try {
    const { email, bookId } = req.query;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isFavourite = user.favouriteBooks.some(fav => fav.bookId === bookId);
    res.status(200).json({ isFavourite });
  } catch (error) {
    console.error('Error checking favourite:', error);
    res.status(500).json({ message: 'Error checking favourite' });
  }
});

// endpoint to get Favourites
app.get('/getFavourites', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    const FavBooks = user.favouriteBooks;
    return res.status(200).json(FavBooks);
  } catch (error) {
    console.error('Error fetching favourites:', error);
    res.status(500).json({ message: 'Error checking favourite' });
  }
})

//buy the book and save it 
app.post('/buyBook', async (req, res) => {
  try {
    const { email, bookId } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.booksBought.push({ bookId });
    await user.save();
    res.status(200).json({ message: "Book added to favourites" });
  } catch (error) {
    console.error('Error adding to favourites:', error);
    res.status(500).json({ message: 'Error adding to favourites' });
  }
});

//get bought books
app.get('/getBuyHistory', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    const books = user.booksBought;
    return res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching buy history:', error);
    res.status(500).json({ message: 'Error fetching buy history' });
  }
})

