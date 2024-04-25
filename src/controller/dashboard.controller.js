const EmployeeModel = require("../models/Employee");
const mssql = require("mssql");
const sql = require("mssql/msnodesqlv8");
class Dashboard {
  async get(req, res) {
    try {
      const request = new sql.Request();
      const HR = await request.query("select * from Personal");
      const Sip = await EmployeeModel.find();
      const Hr = HR.recordsets[0];
      let employment = await request.query("select * from Employment");
      employment = employment.recordsets[0];
      const data = Sip.map((sipItem) => {
        const hrItem = Hr.find((hr) => hr.Employee_ID == sipItem.employeeId);
        if (hrItem) return { ...sipItem._doc, ...hrItem };
      });

      const employementData = Sip.map((sipItem) => {
        const hrItem = employment.find(
          (hr) => hr.Employee_ID == sipItem.employeeId
        );
        if (hrItem) return { ...sipItem._doc, ...hrItem };
      });

      console.log(employementData);

      const employmentStatus = employementData.filter(
        (item) => item?.Employment_Status == "Full time"
      );

      const male = data.filter((item) => item?.Gender == true);
      const shareHolder = data.filter(
        (item) => item?.Shareholder_Status == true
      );
      return res.status(200).json({
        data: data,
        amount: data.length,
        male: male.length,
        female: data.length - male.length,
        shareHolder: shareHolder.length,
        employmentStatus: data.length - employmentStatus.length,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new Dashboard();
