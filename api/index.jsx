const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const morgan=require('morgan')
const cloudinary=require('../assets/utils/cloudinaryConfig.jsx')

const app = express();
const port = 8000;
app.use(cors(
  {
    credentials: true,
    origin: '*'
  }
));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(morgan('dev'))

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

const { error } = require('console');

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
    const { name, email, password } = req.query;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User is already Registered" });
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(200).json({ message: "User registered successfully. Verification email sent." });
  } catch (error) {
    console.log('Error in the end', error.response || error.message || error);
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
    console.log(`Error logging in: ${error.response}`);
    res.status(500).json({ message: `Error logging in ${error}` });
  }
});

//end point to get UserInfo for Profile
app.get('/userProfile', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const userInfo = await User.findOne({ email });
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(userInfo);
  } catch (err) {
    console.error(`Error getting data: ${err.message}`);
    res.status(500).json({ message: "Error getting User Info" });
  }
});


//endpoint to save in user data 
app.post('/updateUserProfile', async (req, res) => {
  try {
    const { email, name, age, gender, phone, profilePicture } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${profilePicture}`, {
      folder: 'user_picture', 
    });

    // Get the secure URL of the uploaded image
    const imageUrl = result.secure_url;

    const userInfo = await User.findOne({ email });
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    userInfo.name = name;
    userInfo.age = age;
    userInfo.gender = gender;
    userInfo.phone = phone;
    userInfo.profilePicture=imageUrl;
    await userInfo.save();
    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(`Error updating data: ${err.message}`);
    res.status(500).json({ message: "Error updating user info" });
  }
});

//endpoint to add a book to the user
app.post('/createBook', async (req, res) => {
  try {
    const { user, createdBook } = req.body;
    const { title, author, genre, description, coverImage } = createdBook;
    // Upload the cover image to Cloudinary
    // const imageUrl = await uploadToCloudinary(`data:image/jpeg;base64,${coverImage}`);

    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${coverImage}`, {
      folder: 'book_covers', // Optional folder name
    });

    // Get the secure URL of the uploaded image
    const imageUrl = result.secure_url;

    let book = await User.findOne({ email: user });
    if (!book) {
      book = new Order({ user, createdBooks: [{ title, author, genre, description, coverImage:imageUrl }] });
    } else {
      book.createdBooks.push({ title, author, genre, description, coverImage:imageUrl });
    }
    await book.save();
    res.status(200).send(book);
  } catch (err) {
    console.error('Error saving book:', err);
    res.status(500).send({err });
  }
});

app.get('/getCurrentCollections', async(req,res)=>{
  try{
  const {email}= req.query;
  const user=await User.findOne({email:email})
  const createdBooks=user.createdBooks;
  return res.status(200).json(createdBooks)
  }catch(err){
    console.error('Error getting collections:', err);
    res.status(500).send({err});
  }
})

// endpoint to delete a created book
app.delete('/deleteCreatedBook', async (req, res) => {
  const { email, item } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const bookIndex = user.createdBooks.findIndex(
      (book) => book._id.toString() === item._id.toString()
    );
    if (bookIndex !== -1) {
      user.createdBooks.splice(bookIndex, 1);
      await user.save();
      return res.status(200).json({ message: "Book deleted successfully" });
    } else {
      return res.status(400).json({ message: "Book Not Found" });
    }
  } catch (err) {
    console.error('Error deleting collection:', err);
    return res.status(500).send({ err });
  }
});



