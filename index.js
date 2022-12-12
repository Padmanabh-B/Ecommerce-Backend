const connectWithDB = require("./config/db");
require("dotenv").config();
const app = require("./app");


const cloudinary = require("cloudinary")


//Connect with DATABASE
connectWithDB()



//clodinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


app.listen(process.env.PORT, () => {
    console.log(`Server is Running on http://localhost:${process.env.PORT}`);
})