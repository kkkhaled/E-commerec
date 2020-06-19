const express = require("express");
const router = express.Router();

const { acceessRoles, protect } = require("../middleware/auth");

const {
  getme,
  login,
  updateAccount,
  updatePassword,
  register,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");
router.route("/getme").get(protect, getme);
router.route("/updatePassword").put(protect, updatePassword);
router.route("/updateaccount").put(protect, updateAccount);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgetpassword").post(protect, forgotPassword);
router.route("/resetPassword/:resettoken").post(protect, resetPassword);

module.exports = router;
