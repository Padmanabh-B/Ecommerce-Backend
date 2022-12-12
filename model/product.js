const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Provide Product Name"],
        trim: true,
        maxlength: [120, "Name Should not be exceeds 120 characters"]
    },
    price: {
        type: Number,
        required: [true, "Please Provide Product Price"],
        maxlength: [5, "Product Price not be exceeds 5 digits"]
    },
    price: {
        type: String,
        required: [true, "Please Provide Product Description"],
    },
    photos: [
        {
            id: {
                type: String,
                required: true,
            },
            secure_url: {
                type: String,
                required: true,
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please select category from - short-sleeves, long-sleeves, sweatshirt, hoodies"],
        enum: {
            values: [
                'shortsleeves',
                'longsleeves',
                'sweatshirt',
                'hoodies',
            ],
            message: "Please select category ONLY from - short-sleaves, long-sleaves, short-sleaves, hoodies"
        }
    },
    stock: {
        type: Number,
        required: [true, "Please Add A Number in Stock"]
    },
    brand: {
        type: String,
        required: [true, "please add a brand for clothing"],
    },
    ratings: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("Products", productSchema)