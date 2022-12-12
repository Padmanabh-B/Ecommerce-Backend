const User = require("../model/user")
const BigPromise = require("../middlewares/bigPromise")
const CustomError = require("../utils/customError")
const cookieToken = require("../utils/cookieToken")
const cloudinary = require("cloudinary").v2
const mailHelper = require("../utils/emailHelper")
const crypto = require("crypto")

// Signup  Route
exports.signup = BigPromise(async (req, res, next) => {

  let result;

  if (!req.files) {
    return next(new CustomerError("photo is required for signup", 400))
  }

  const { name, email, password } = req.body;

  if (!name || !name || !password) {
    return next(new CustomError("All Fields are Mandatory!!!", 400));
  }

  const file = req.files.photo;

  result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: 'users',
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      public_id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  cookieToken(user, res);
});

// Login Route
exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  //check for presence of email and password
  if (!email || !password) {
    return next(new CustomError("Please Provide email and password", 400))
  }

  //get user form DB
  const user = await User.findOne({ email }).select("+password")

  // if user not found in DB
  if (!user) {
    return next(new CustomError("Email or passoword does not match", 400))
  }

  //match the password
  const isPasswordCorrect = await user.isValidatedPassword(password)

  // if password does not match
  if (!isPasswordCorrect) {
    return next(new CustomError("Email or passoword does not match", 400))
  }

  //if all goes good send user
  cookieToken(user, res)



});

// Logout
exports.logout = BigPromise(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })
  res.status(200).json({
    success: true,
    message: "Logout Success"
  })
});

// Forgot Password
exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new CustomError("Email not Found As Registed", 400))

  }

  // get token from user model messages
  const forgotToken = await user.getForgotPasswordToken();

  //not check everthing just save everthing
  user.save({ validateBeforeSave: false })

  //create a url
  const myUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`

  //crafting message
  const message = `Copy Paste this link in your URL and hit enter \n\n ${myUrl}`;

  //attempt to send mail
  try {

    await mailHelper({
      email: user.email,
      subject: "SPB TShirt Store - Password reset email",
      message,
    })

    res.status(200).send("Email Send Successfully")


  } catch (error) {
    user.forgotPasswordToken = undefined,
      user.forgotPasswordExpiry = undefined,
      await user.save({ validateBeforeSave: false })

    return next(new CustomError(error.message, 500))
  }

});

//Reset Password Through Mail
exports.passwordReset = BigPromise(async (req, res, next) => {

  //grab token from params
  const token = req.params.token;

  //Encrypt token
  const encryToken = crypto.createHash('sha256').update(token).digest('hex');

  //  @Find_One = check the encrypted token and date of expire that is greaten than now

  const user = await User.findOne({
    forgotPasswordToken: encryToken,
    forgotPasswordExpiry: {
      $gt: Date.now()
    }
  });

  // if User Not found throw error
  if (!user) {
    return next(new CustomError("Token is Invalid or Expired", 400))
  }

  // if password and confirm password doesnot match throw error
  if (req.body.password !== req.body.confirmPassword) {
    return next(new CustomError("Password is Confirm Password is don't match", 400))
  }


  // if all ok assign old password to new password and also clear the forgorPasswordToken
  // and forgotPasswordExpiry

  user.password = req.body.password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;


  //At last save with new values that is password
  await user.save();

  // send json response or send token

  cookieToken(user, res);

});

//display Profile
exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {

  const user = await User.findById(req.user.id);

  res.status(201).json({
    success: true,
    user
  })


  cookieToken(user, res);

});


//change password on logged in
exports.changePassword = BigPromise(async (req, res, next) => {

  const userId = req.user.id;

  const user = await User.findById(userId).select("+password")

  const isCorrectOldPassword = await user.isValidatedPassword(req.body.oldPassword)

  if (!isCorrectOldPassword) {
    return next(new CustomError("Old Password is incorrect", 400));
  }

  user.password = req.body.password;

  await user.save()

  //update the cookie
  cookieToken(user, res);
});


exports.updateUserDetails = BigPromise(async (req, res, next) => {

  //holding data in variables
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };

  //added a check for email name in body
  if (!(req.body.name)) {
    return next(new CustomError("Name Must Be Provide"))
  }

  if (!(req.body.email)) {
    return next(new CustomError("Email Must Be Provide"))
  }

  //check if files are comming 
  if (req.files) {
    const user = await User.findById(req.user.id);

    //assign value of photo id to imageid
    const imageId = user.photo.public_id;

    //delete photo from cloudinary
    const response = await cloudinary.uploader.destroy(imageId);

    //Upload new photo
    result = await cloudinary.uploader.upload(req.files.photo.tempFilePath, {
      folder: 'users',
      width: 150,
      crop: "scale",
    });

    //updating newData
    newData.photo = {
      public_id: result.public_id,
      secure_url: result.secure_url
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(201).json({
    success: true,
    //its your choice to send user data to frontend or not
    user,

  })


});

//Admin Get All users
exports.adminAllUsers = BigPromise(async (req, res, next) => {

  //array of users
  const users = await User.find()

  res.status(200).json({
    success: true,
    users,
  });



});

// Manager Rollers
exports.managerAllUsers = BigPromise(async (req, res, next) => {

  //array of users
  const users = await User.find({ role: "user" })

  res.status(200).json({
    success: true,
    users,
  });



});


//get One User
exports.adminOneUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new CustomerError("No user Found", 400))
  }
  res.status(200).json({
    success: true,
    user,
  })



});


//admin update one user
exports.adminUpdateOneUserDetails = BigPromise(async (req, res, next) => {
  const newData = {
    name:req.body.name,
    email:req.body.email,
    role:req.body.role,
  }

  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(201).json({
    success: true,
    //its your choice to send user data to frontend or not
    user,

  })


});

//admin delete one user
exports.adminDeleteOneUserDetails = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if(!user){
    return next(new CustomError("No Such user found", 401))
  }

  const imageId = user.photo.public_id;

  await cloudinary.uploader.destroy(imageId)

  await user.remove()

  res.status(200).json({
    success:true,
    
  })


});

