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
                required: true
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
            }
        }
    ],

});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
