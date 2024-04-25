const employee = require("./employee.routes");
const employees = require("./employees.routes");
const further = require("./further.routes");
const dashboard = require("./dashboard.routes");

function router(app) {
  app.use("/api/dashboard", dashboard);
  app.use("/api/employee", employee);
  app.use("/api/further", further);
  app.use("/api/employees", employees);
}

module.exports = router;
