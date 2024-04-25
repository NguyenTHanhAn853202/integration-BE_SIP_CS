const employeeControler = require("../controller/employee.controler");

const router = require("express").Router();

router.post("/delete", employeeControler.deleteEmployee);
router.post("/edit", employeeControler.editEmpoyee);

router.get("/birthday", employeeControler.getBirthday);
router.get("/average-plan", employeeControler.averagePlan);
router.get("/hire-day", employeeControler.hireDay);
router.get("/vocation-days", employeeControler.vocationDay);
router.get("/", employeeControler.getEmployee);



// 




module.exports = router;
