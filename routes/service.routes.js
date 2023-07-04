const express = require("express");
const {
  getAllServices,
  addService,
  getServiceById,
  editService,
  deleteService,
} = require("../controllers/service.controllers");

const router = express.Router();

router.get("/get", getAllServices);
router.post("/add", addService);
router.get("/get/:id", getServiceById);
router.put("/edit/:id", editService);
router.delete("/delete/:id", deleteService);

module.exports = router;
