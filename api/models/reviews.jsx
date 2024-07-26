const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    bookid: {
        type: String,
        required: true,
        unique: true,
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
                type: Number
            },
            dislikes: {
                type: Number
            }
        }
    ]
})


const Review=mongoose.model('reviews', reviewSchema)

module.exports=Review