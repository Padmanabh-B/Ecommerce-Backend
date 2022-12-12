const cookieParser = require("cookie-parser");
const express = require("express");
const fileUpload = require("express-fileupload");
require("dotenv").config()
const app = express();
const morgan = require("morgan")


//for swagger documentation
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const { homeDummy } = require("./controller/homeController");
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// temp engine
app.set('view engine', "ejs")


//regular middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//cookie and file middleware
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))



//morgon middleware
app.use(morgan("tiny"))

app.get("/signuptest",(req,res)=>{
    res.render("signupTest")
})


// import routes
const home = require("./routes/home");
const user = require("./routes/user")
const product = require("./routes/product")
const payment = require("./routes/payment")
const order = require("./routes/order")

/* Router */
app.use("/api/v1", home)
app.use("/api/v1", user)
app.use("/api/v1", product)
app.use("/api/v1", payment)
app.use("/api/v1", order)


/* @Export App */
module.exports = app;
