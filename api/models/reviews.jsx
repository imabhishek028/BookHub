const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: String,
        required: true,
    },
    reviews: [
        {
            userid: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            reviewBody: {
                type: String,
                required: true,
            },
            likes: {
                type: Number,
                default: 0,
            },
            dislikes: {
                type: Number,
                default: 0,
            },
            likedBy: [{
                type: String,
                default: [],
            }],
            dislikedBy: [{
                type: String,
                default: [],
            }],
        }
    ],
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
