const { Router } = require("express");

const clientRouter = require("./client.routes");
const adminRouter = require("./admin.routes");
const otpRouter = require("./otp.routes");
const queueRouter = require("./queue.routes");
const serviceRouter = require("./service.routes");

const router = Router();

router.use("/client", clientRouter);
router.use("/admin", adminRouter);
router.use("/otp", otpRouter);
router.use("/queue", queueRouter);
router.use("/service", serviceRouter);

module.exports = router;
