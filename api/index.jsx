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

// import {MONGODB_LINK, USER_EMAIL, USEREMAIL_PASS} from '@env';
// const { MONGODB_LINK, USER_EMAIL, USEREMAIL_PASS } = require('@env');

// const MONGODB_LINK = process.env.MONGODB_LINK;
// const USER_EMAIL = process.env.USER_EMAIL;
// const USEREMAIL_PASS = process.env.USEREMAIL_PASS;

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
const Review = require('./models/reviews.jsx');
const { log } = require('console');

const generateSecretKey = () => {
  const secret = crypto.randomBytes(3).toString("hex");
  return secret;
}

const secretKey = generateSecretKey();

const sendChangePasswordMail = async (email, secretKey) => {
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
    subject: 'Email Change Password',
    text: `Your passKey is : ${secretKey}`,
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
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User is already registered" });

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(200).json({ message: "User registered successfully. Verification email sent." });
  } catch (error) {
    console.error(`Error updating data: ${JSON.stringify(error, null, 2)}`);
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

//ForgotPassword
app.post('/forgotPasswordEmail', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(404).json({ message: "Fill in all the fields" })
    }
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(201).json({ message: 'No account associated with this email' })
    }
    else {
      await sendChangePasswordMail(email, secretKey);
      return res.status(200).json({ message: "Email sent" })
    }
  } catch (err) {
    console.log(`Error sending mail in: ${err}`);
    res.status(500).json({ message: `Error sending mail in ${err}` });
  }
})

// endpoint to reset user password:
app.post('/resetPassword', async (req, res) => {
  try {
    const { email, passKey, password } = req.body;
    const user = await User.findOne({email})
    if (!user) {
      return res.status(404).json({ message: 'No account associated with this email' })
    } else {
      if (passKey === secretKey) {
        user.password = password;
        await user.save();
        return res.status(200).json({ message: "Password Updated" })
      } else {
        return res.status(400).send({ message: "Incorrect passkey" })
      }
    }
  } catch (err) {
    console.log(`Error updating password : ${err}`);
    return res.status(500).json({ message: `Error updating password ${err}` });
  }
})

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

    let imageUrl;
    if (profilePicture) {
      const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${profilePicture}`, { folder: 'user_picture' });
      imageUrl = result.secure_url;
    }

    const userInfo = await User.findOne({ email });
    if (!userInfo) return res.status(404).json({ message: "User not found" });

    userInfo.name = name;
    userInfo.age = age;
    userInfo.gender = gender;
    userInfo.phone = phone;
    if (imageUrl) {
      userInfo.profilePicture = imageUrl;
    }
    await userInfo.save();

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(`Error updating data: ${JSON.stringify(err, null, 2)}`);
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
    return es.status(500).send({ err });
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
    return res.status(500).send({ err });
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
    return res.status(500).json({ message: 'Error adding to favourites' });
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
    return res.status(500).json({ message: 'Error removing from favourites' });
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
    return res.status(500).json({ message: 'Error checking favourite' });
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
    return res.status(500).json({ message: 'Error checking favourite' });
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
    return res.status(500).json({ message: 'Error adding to favourites' });
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
    return res.status(500).json({ message: 'Error fetching buy history' });
  }
})

//Update Password:
app.post('/updatePassword', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ email: email })
    if (user.password.toString() != oldPassword) {
      return res.status(401).json({ message: 'Incorrect previous password' })
    } else {
      user.password = newPassword;
      await user.save();
      return res.status(200).json({ message: "Password updated successfully" })
    }
  } catch (err) {
    console.error('Error updating password:', err);
    return res.status(500).json({ message: 'Error updating password' });
  }
})

app.post('/review', async (req, res) => {
  try {
    const { email, bookId, rating, review } = req.body;
    console.log('Received data:', { email, bookId, rating, review });
    if (!email || !bookId || !rating || !review) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let bookReview = await Review.findOne({ bookId: bookId });

    if (bookReview) {
      const userReview = bookReview.reviews.find(r => r.userid === email);
      if (userReview) {
        userReview.rating = rating;
        userReview.reviewBody = review;
        await bookReview.save();
        return res.status(200).json({ message: 'Review added successfully' });
      } else {
        bookReview.reviews.push({ userid: email, rating, reviewBody: review });
        await bookReview.save();
        return res.status(200).json({ message: 'Review added successfully' });
      }
    } else {
      bookReview = await Review.create({ bookId: bookId, reviews: [{ userid: email, rating, reviewBody: review }] })
      return res.status(200).json({ message: 'Review added successfully' });
    }

  } catch (err) {
    console.error(`Error : ${err}`);
    return res.status(500).json({ message: "Error reviewing the book" });
  }
});



// get current review to edit
app.get('/getUserReview', async (req, res) => {
  try {
    const { email, bookId } = req.query;
    const book = await Review.findOne({ bookId });

    if (book) {
      const userReview = book.reviews.find(r => r.userid === email);
      if (userReview) {
        return res.status(200).json({ userReview });
      } else {
        return res.status(404).send('User is commenting for the first time');
      }
    } else {
      return res.status(404).send('Book not found.');
    }
  } catch (err) {
    console.error(`Error getting user review: ${err}`);
    return res.status(500).json({ message: "Error reviewing the book" });
  }
});


// end pooint to get all the reviews for a book
app.get('/getBookReviews', async (req, res) => {
  try {
    const { bookId } = req.query;
    const bookReviews = await Review.findOne({ bookId });

    if (!bookReviews) {
      return res.status(201).json({ message: "No review for the book found" });
    } else {
      return res.status(200).json({ bookReviews });
    }
  } catch (error) {
    console.error('Error fetching review:', error);
    return res.status(500).json({ message: 'Error fetching review' });
  }
});


// Delete user review
app.delete('/deleteUserReview', async (req, res) => {
  try {
    const { email, bookId } = req.body;
    const bookReviews = await Review.findOne({ bookId });

    if (!bookReviews) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      const userReview = bookReviews.reviews.find(r => r.userid === email);
      if (!userReview) {
        return res.status(404).json({ message: "User not found" });
      } else {
        bookReviews.reviews = bookReviews.reviews.filter(user => user.userid !== email);
        await bookReviews.save();
        return res.status(200).json({ message: "Book review by the user deleted" });
      }
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({ message: 'Error deleting review' });
  }
});


// endpoint to update user likes:
app.post('/updateLikes', async (req, res) => {
  try {
    const { email, bookId, reviewId, action } = req.body;
    const bookReview = await Review.findOne({ bookId });

    if (!bookReview) {
      return res.status(404).json({ message: "Book not found" });
    }

    const userReview = bookReview.reviews.id(reviewId);
    if (!userReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (action === 'like') {
      if (!userReview.likedBy.includes(email)) {
        userReview.likes += 1;
        userReview.likedBy.push(email);

        // Remove from dislikedBy if exists
        const index = userReview.dislikedBy.indexOf(email);
        if (index > -1) {
          userReview.dislikedBy.splice(index, 1);
          userReview.dislikes -= 1;
        }
      } else {
        return res.status(400).json({ message: "User has already liked this review" });
      }
    } else if (action === 'dislike') {
      if (!userReview.dislikedBy.includes(email)) {
        userReview.dislikes += 1;
        userReview.dislikedBy.push(email);

        const index = userReview.likedBy.indexOf(email);
        if (index > -1) {
          userReview.likedBy.splice(index, 1);
          userReview.likes -= 1;
        }
      } else {
        return res.status(400).json({ message: "User has already disliked this review" });
      }
    }
    await bookReview.save();
    return res.status(200).json({ message: "Review updated successfully" });
  } catch (error) {
    console.error('Error updating review:', error);
    return res.status(500).json({ message: 'Error updating review' });
  }
});



