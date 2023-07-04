const { Router } = require("express");
const {
  addClient,
  getClient,
  deleteClient,
  updateClient,
  getClientById,
} = require("../controllers/client.controller");

const router = Router();

router.post("/add", addClient);
router.get("/get", getClient);
router.delete("/delete/:id", deleteClient);
router.put("/update/:id", updateClient);
router.get("/get/:id", getClientById);

module.exports = router;
