const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const Mailer = require("../utils/sendEmail");
const asyncHandler = require("../middleware/ascyncHandler");
const forgetpassTemplate = require("../templates/forgotPass");

// register users
// route /api/v1/auth/register
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password, role, phone } = req.body;
  const user = await User.create(req.body);
  getResponseToken(user, 200, res);
});
// login users
// route /api/v1/auth/login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //validate email and password
  if (!email || !password) {
    return next(new ErrorResponse(`email and password is required`, 400));
  }
  //get user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse(`invalid email`, 400));
  }
  //match password
  const isMatch = await user.MatchPass(password);
  if (!isMatch) {
    return next(new ErrorResponse(`invalid password`, 400));
  }
  getResponseToken(user, 200, res);
});
//get logged in user
// route /api/v1/auth/getme
exports.getme = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});
// update account data
// route /api/v1/auth/updatedata/:id
exports.updateAccount = asyncHandler(async (req, res, next) => {
  const fieldToUpdate = {
    username: req.body.username,
    phone: req.body.phone,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});
// update password
// route /api/v1/auth/updatePassword
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!user.MatchPass(req.body.currentPassword)) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  getResponseToken(user, 200, res);
});
// forgot password
// route /api/v1/auth/forgetpassword
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new ErrorResponse(`no user with that email address`, 404));
  }
  // generate resettoken
  const resetToken = user.createPasswordToken();
  await user.save({ validateBeforeSave: false });
  // send resetToken to user via email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;
  console.log(resetUrl);
  try {
    await Mailer.sendEmail({
      email: user.email,
      subject: `your reset password token avaliable for 10 min`,
      resetUrl,
      html: forgetpassTemplate,
    });
    res.status(200).json({ success: true, data: "Token sent to Email" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});
// reset Password
// /api/v1/auth/resettoken
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse("Invalid token", 404));
  }
  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  getResponseToken(user, 200, res);
});
// Get token from model, create cookie and send response
const getResponseToken = (user, statusCode, res) => {
  const token = user.createToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
