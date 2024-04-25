const dashboardController = require("../controller/dashboard.controller");

const router = require("express").Router();

router.get("/", dashboardController.get);

module.exports = router;
