const express = require("express");

const {
  getAllQueues,
  addQueue,
  getQueueById,
  editQueue,
  deleteQueue,
} = require("../controllers/queue.controller");

const router = express.Router();

router.get("/get", getAllQueues);
router.post("/add", addQueue);
router.get("/get/:id", getQueueById);
router.put("/edit/:id", editQueue);
router.delete("/delete/:id", deleteQueue);

module.exports = router;
