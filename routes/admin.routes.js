const { Router } = require("express");
const {
  addAdmin,
  getAllAdmin,
  editAdmin,
  deleteAdmin,
  getAdminById,
} = require("../controllers/admin.controller");

const router = Router();

router.post("/add", addAdmin);
router.get("/get", getAllAdmin);
router.put("/edit/:id", editAdmin);
router.delete("/del/:id", deleteAdmin);
router.get("/get/:id", getAdminById);

module.exports = router;
