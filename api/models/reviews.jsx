const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: String,
        required: true,
        unique:true,
    },
    reviews: [
        {
            userid: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,

            },
            reviewBody: {
                type: String,
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
    ]
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
