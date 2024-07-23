const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,

    },
    age: {
        type: Number,
        default: null
    },
    phone: {
        type: Number,
        default: null
    },
    gender: {
        type: String,
        default: null
    },
    profilePicture: {
        type: String
    },
    verificationToken: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBooks: [
        {
            title: {
                type: String,
            },
            author: {
                type: String,
            },
            genre: {
                type: String,

            },
            description: {
                type: String,

            },
            coverImage: {
                type: String,
            }
        }
    ],
    favouriteBooks:[
       {
        bookId:{
            type:String,
        }
       }
    ],
    booksBought:[
        {
            bookId:{
                type:String
            }
        }
    ]
})

const User = mongoose.model("User", userSchema)
module.exports = User