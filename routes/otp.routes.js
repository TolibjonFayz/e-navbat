const express = require("express");
const {
  getAllOtp,
  addOtp,
  getOtpById,
  updateOtp,
  deleteOtp,
  newOTP,
  verifyOTP,
} = require("../controllers/otp.controller");

const router = express.Router();

router.get("/get", getAllOtp);
router.post("/add", newOTP);
router.get("/get/:id", getOtpById);
router.put("/edit/:id", updateOtp);
router.delete("/del/:id", deleteOtp);
router.post("/verify", verifyOTP);

module.exports = router;
