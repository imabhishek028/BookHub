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
    age:{
        type:Number,
        default:null
    },
    phone:{
        type:Number,
        default:null
    },
    gender:{
        type:String,
        default:null
    },
    verificationToken: String,
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    photo:{
        type:String,
        default:null
    }
})

const User = mongoose.model("User", userSchema)
module.exports = User