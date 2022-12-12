const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Provide a Name'],
        maxlength: [40, 'Name Should be under 40 characters']
    },
    email: {
        type: String,
        required: [true, 'Please Provide a Email'],
        validate: [validator.isEmail, 'Please Enter Email in Correct Format'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please Provide a Password'],
        minlength: [6, 'Password should be at least 6 char'],
        select: false,
    },
    role: {
        type: String,
        default: "user"
    },
    photo: {
        public_id: {
            type: String,
        },
        secure_url: {
            type: String,
        }
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Encrypt password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
});

//validate password(compare password) with passes on user password
userSchema.methods.isValidatedPassword = async function (usersendPassword) {
    return await bcrypt.compare(usersendPassword, this.password)
}
//
// create and return JWT Token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY })
}

//generate forgot password
userSchema.methods.getForgotPasswordToken = function () {
    //generate a long and random string

    const forgotToken = crypto.randomBytes(20).toString('hex')

    //getting a hash - make sure to get a hash on backend
    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

    //time of token
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

    return forgotToken;

}

module.exports = mongoose.model("User", userSchema);
