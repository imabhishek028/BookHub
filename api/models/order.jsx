const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true,
    },
    createdBooks: [
        {
            title: {
                type: String,
                required: true
            },
            author: {
                type: String,
                required: true
            },
            genre: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            coverImage: {
                type: String,
                required: true
            }
        }
    ]
})

const Order = mongoose.model("Order", orderSchema)

module.exports = Order