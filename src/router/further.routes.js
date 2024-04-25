const furtherController = require("../controller/further.controller");

const router = require("express").Router();

router.get("/department", furtherController.getDepartment);
router.get("/benifit-plan", furtherController.getBenifitPlan);
router.post("/create-personal", furtherController.createEmployee);

module.exports = router;
