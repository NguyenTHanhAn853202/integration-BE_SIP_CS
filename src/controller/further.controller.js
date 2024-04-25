const mssql = require("mssql");
const sql = require("mssql/msnodesqlv8");
const { hrBaseUrl, sipBaseUrl } = require("../utils/baseURL");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { fetchPost } = require("../utils/customFetch");

class Further {
  async getDepartment(req, res) {
    try {
      const hr = await fetch(hrBaseUrl + "/JobHistoryAPI/getDepartment/all");
      const data = JSON.parse(await hr.json());
      return res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createEmployee(req, res) {
    try {
      const {
        employeeId,
        firstName,
        lastName,
        gender,
        status,
        ethnicity,
        paidLastYear,
        paidToDate,
        department,
        birthday,
        hireDate,
        vocationDays,
        address1,
        address2,
        email,
        phoneNumber,
        benifitPlan,
        shareHolder,
      } = req.body;

      const sip = await fetchPost(sipBaseUrl + "/employee", {
        employeeId: employeeId.toString(),
        firstName: firstName,
        lastName: lastName,
        vacationDays: vocationDays,
        paidLastYear,
        paidToDate,
        birthDay: birthday,
      });
      const dataSip = await sip.json();
      const hr = await fetchPost(hrBaseUrl + "/Income/createPersonal/all", {
        Employee_ID: employeeId,
        First_Name: firstName,
        Last_Name: lastName,
        Gender: gender,
        Ethnicity: ethnicity,
        Address1: address1,
        Address2: address2,
        Email: email,
        PhoneNumber: phoneNumber,
        Benefit_Plans: benifitPlan,
        Shareholder_Status: shareHolder ? 1 : 0,
      });
      const hrE = await fetchPost(hrBaseUrl + "/Income/createEmployment/all", {
        Employee_ID: employeeId,
        Hire_Date: hireDate,
        Employment_Status: status,
      });
      const hrD = await fetchPost(hrBaseUrl + "/Income/createDepartment/all", {
        Employee_ID: employeeId,
        ID: department.ID,
        Department: department.department,
        Department_Code: department.departmentCode,
      });
      const datahr = await hr.json();
      const datahrE = await hrE.json();
      const datahrD = await hrD.json();
      return res.status(200).json(dataSip, datahr, datahrE, datahrD);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  async getBenifitPlan(req, res) {
    try {
      const request = new sql.Request();
      let data = await request.query(`select * from Benefit_Plans`);
      data = data.recordsets[0];
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new Further();
