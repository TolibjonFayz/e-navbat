const express = require("express");
const {
  getAllOtp,
  getOtpById,
  updateOtp,
  newOTP,
  verifyOTP,
  deleteOTP,
} = require("../controllers/otp.controller");
const clientPolice = require("../middlewares/clientPolice");

const router = express.Router();

router.get("/get", clientPolice, getAllOtp);
router.post("/add", newOTP);
router.get("/get/:id", getOtpById);
router.put("/edit/:id", updateOtp);
router.delete("/del", deleteOTP);
router.post("/verify", verifyOTP);

module.exports = router;
