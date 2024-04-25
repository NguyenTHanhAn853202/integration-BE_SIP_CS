const employeesController = require("../controller/employees.controller");

const router = require("express").Router();

router.post("/delete", employeesController.deleteEmployee);
router.post("/edit", employeesController.editEmpoyee);
router.post("/create", employeesController.createEmployee);

router.get("/vocation-days", employeesController.vacationDays);
router.get("/hire-day", employeesController.hireDate);
router.get("/birthday", employeesController.getBirthday);
router.get("/average-plan", employeesController.averagePlan);
router.get("/", employeesController.getEmployee);

module.exports = router;
