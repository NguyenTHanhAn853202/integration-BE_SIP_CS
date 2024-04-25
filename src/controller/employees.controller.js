const EmployeeModel = require("../models/Employee.js");
// const mssql = require("mssql");
const mssql = require("mssql");
const sql = require("mssql/msnodesqlv8");
const filterId = require("../utils/filterId.js");

class Employee {
  async getEmployee(req, res) {
    try {
      const { limit = 5, page } = req.query;
      const start = (page - 1) * limit;
      const sipResponse = await EmployeeModel.find().limit(limit).skip(start);
      const id = filterId(sipResponse);
      const request = new sql.Request();
      let hrResponse = await request.query(
        `select * from Personal P INNER JOIN Job_History on P.Employee_ID = Job_History.Employee_ID INNER JOIN EMPLOYMENT ON P.Employee_ID = EMPLOYMENT.Employee_ID where P.Employee_ID in (${id} ) `
      );
      hrResponse = hrResponse.recordsets[0];
      const data = [];
      for (let j = 0; j < sipResponse.length; j++) {
        const item = sipResponse[j];

        for (let i = 0; i < hrResponse.length; i++) {
          const HR = hrResponse[i];
          // console.log(HR);
          if (item.employeeId.toString() === HR.Employee_ID[0].toString()) {
            data.push({
              employeeId: item.employeeId,
              fullName: `${item.firstName} ${item.lastName}`,
              firstName: item.firstName,
              lastName: item.lastName,
              gender: HR.Gender,
              ethnicity: HR.Ethnicity,
              paidToDay: item.paidToDate,
              paidLastYear: item.paidLastYear,
              department: HR.Department,
              idDepartment: HR.ID,
              status: HR.Employment_Status,
              birthday: item.birthDay,
              vacationDays: item.vacationDays,
              hireDate: HR.Hire_Date,
              departmentCode: HR.Departmen_Code,
              address1: HR.Address1,
              address2: HR.Address2,
              email: HR.Email,
              phoneNumber: HR.Phone_Number,
              benifitPlan: HR.Benefit_Plans,
              shareHolder: HR.Shareholder_Status,
            });
          }
        }
      }
      const amount = await EmployeeModel.countDocuments();
      return res.status(200).json({
        data,
        amount,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  async getBirthday(req, res) {
    try {
      const { limit = 5, page = 1 } = req.query;
      const month = new Date().getMonth() + 1;
      const sipResponse = await EmployeeModel.find({
        $expr: {
          $eq: [{ $month: "$birthDay" }, month],
        },
      })
        .limit(limit)
        .skip((page - 1) * limit);
      const amount = await EmployeeModel.countDocuments({
        $expr: {
          $eq: [{ $month: "$birthDay" }, month],
        },
      });
      const id = filterId(sipResponse);
      const request = new sql.Request();
      let hrResponse = await request.query(
        `select * from Personal P INNER JOIN Job_History on P.Employee_ID = Job_History.Employee_ID where P.Employee_ID in (${id} ) `
      );
      hrResponse = hrResponse.recordsets[0];
      const data = [];
      for (let j = 0; j < sipResponse.length; j++) {
        const item = sipResponse[j];

        for (let i = 0; i < hrResponse.length; i++) {
          const HR = hrResponse[i];

          if (item.employeeId.toString() === HR.Employee_ID[0].toString()) {
            data.push({
              fullName: `${item.firstName + item.lastName}`,
              gender: HR.Gender,
              ethnicity: HR.Ethnicity,
              birthday: item.birthDay,
              department: HR.Department,
            });
          }
        }
      }
      return res.status(200).json({
        data,
        amount,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async averagePlan(req, res, next) {
    try {
      const sipResponse = await EmployeeModel.find();
      const request = new sql.Request();
      let hrResponse = await request.query(
        `select * from Personal P INNER JOIN Benefit_Plans ON P.Benefit_Plans = Benefit_Plans.Benefit_Plan_ID INNER JOIN Job_History on P.Employee_ID = Job_History.Employee_ID INNER JOIN EMPLOYMENT ON P.Employee_ID = EMPLOYMENT.Employee_ID `
      );

      hrResponse = hrResponse.recordsets[0];

      let data = [];
      for (let j = 0; j < sipResponse.length; j++) {
        const item = sipResponse[j];

        for (let i = 0; i < hrResponse.length; i++) {
          const HR = hrResponse[i];

          if (item.employeeId.toString() === HR.Employee_ID[0].toString()) {
            data.push({ ...HR, ...item._doc });
          }
        }
      }
      const typeBenifit = {};
      data.forEach((item) => {
        // console.log(item);
        typeBenifit[item.Plan_Name] = typeBenifit[item.Plan_Name]
          ? typeBenifit[item.Plan_Name] + item.paidToDate
          : item.paidToDate;
      });
      const dataBenifit = [];
      for (const item in typeBenifit) {
        dataBenifit.push({ plan: item, paid: typeBenifit[item] });
      }
      return res.status(200).json(dataBenifit);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  async hireDate(req, res) {
    try {
      const nowDay = new Date();
      let day = nowDay.getDate() + 2;
      let month = nowDay.getMonth() + 1;

      switch (month) {
        case 4:
        case 6:
        case 9:
        case 11:
          if (day > 30) {
            day = day - 30;
            month = month + 1;
          } else {
            day = day + 2;
          }
          break;
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
          if (day > 31) {
            day = day - 31;
            month = month + 1;
          } else {
            day = day + 2;
          }
          break;
        case 12:
          if (day > 31) {
            day = day - 31;
            month = 1;
          } else {
            day = day + 2;
          }
          break;
        case 2:
          if (
            new Date().getFullYear() % 4 == 0 &&
            new Date().getFullYear() % 100 != 0
          ) {
            if (day > 29) {
              day = day - 29;
              month = month + 1;
            } else {
              day = day + 2;
            }
          } else {
            if (day > 28) {
              day = day - 28;
              month = month + 1;
            } else {
              day = day + 2;
            }
          }
          break;
        default:
          break;
      }
      const request = new sql.Request();
      let data = await request.query(`
        select * from Personal P INNER JOIN EMPLOYMENT E on P.Employee_ID = E.Employee_ID WHERE MONTH(E.Hire_Date) = ${month} and DAY(E.Hire_Date) = ${day}
      `);
      data = data.recordsets[0];
      data = data.map((item) => ({
        fullName: item.First_Name + " " + item.Last_Name,
        gender: item.Gender,
        id: item.Employee_ID[0],
        hireDay: item.Hire_Date,
      }));
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async vacationDays(req, res) {
    try {
      const { limit = 5, page = 1 } = req.query;
      const sipResponse = await EmployeeModel.find()
        .limit(limit)
        .skip((page - 1) * limit);
      const request = new sql.Request();
      const id = filterId(sipResponse);
      let hrResponse = await request.query(
        `select * from Personal P INNER JOIN Job_History on P.Employee_ID = Job_History.Employee_ID INNER JOIN EMPLOYMENT ON P.Employee_ID = EMPLOYMENT.Employee_ID where P.Employee_ID in (${id} ) `
      );

      hrResponse = hrResponse.recordsets[0];
      const data = [];
      for (let j = 0; j < sipResponse.length; j++) {
        const item = sipResponse[j];

        for (let i = 0; i < hrResponse.length; i++) {
          const HR = hrResponse[i];

          if (item.employeeId.toString() === HR.Employee_ID[0].toString()) {
            data.push({
              employeeId: item.employeeId,
              fullName: `${item.firstName} ${item.lastName}`,
              firstName: item.firstName,
              lastName: item.lastName,
              gender: HR.Gender,
              ethnicity: HR.Ethnicity,
              paidToDay: item.paidToDate,
              paidLastYear: item.paidLastYear,
              department: HR.Department,
              idDepartment: HR.ID,
              status: HR.Employment_Status,
              birthday: item.birthDay,
              vacationDays: item.vacationDays,
              hireDate: HR.Hire_Date,
              departmentCode: HR.Departmen_Code,
              address1: HR.Address1,
              address2: HR.Address2,
              email: HR.Email,
              phoneNumber: HR.Phone_Number,
              benifitPlan: HR.Benefit_Plans,
              shareHolder: HR.Shareholder_Status,
            });
          }
        }
      }
      const amount = await EmployeeModel.countDocuments();
      return res.status(200).json({ data, amount });
    } catch (error) {
      return res.status(200).json({ message: error.message });
    }
  }
  async deleteEmployee(req, res) {
    try {
      const { id, employeeId } = req.body;
      await EmployeeModel.deleteOne({ employeeId: employeeId.toString() });
      const request = new sql.Request();
      await request.query(
        `delete from EMPLOYMENT WHERE Employee_ID = ${employeeId * 1}`
      );
      await request.query(`delete from Job_History WHERE ID = ${id * 1}`);
      await request.query(
        `delete from Personal WHERE Employee_ID = ${employeeId * 1}`
      );
      return res.status(200).json("success");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async editEmpoyee(req, res) {
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
      await EmployeeModel.updateOne(
        { employeeId: employeeId.toString() },
        {
          firstName: firstName,
          lastName: lastName,
          vacationDays: vocationDays,
          paidLastYear,
          paidToDate,
          birthDay: birthday,
        }
      );

      const request = new sql.Request();
      await request.query(`
        update Personal set First_Name = '${firstName}',Last_Name = '${lastName}',
        Gender = ${gender ? 1 : 0},
        Ethnicity = '${ethnicity}',
        Address1 = '${address1}',
        Address2 = '${address2}',
        Email = '${email}',
        Phone_Number = '${phoneNumber}',
        Shareholder_Status = ${shareHolder ? 1 : 0},
        Benefit_Plans = ${benifitPlan}
        where Employee_ID = ${employeeId * 1}

      `);

      const hireDateConvert = new Date(hireDate); // Assume you have the hire date in this variable
      const formattedHireDate = hireDateConvert.toISOString().slice(0, 10);

      await request.query(
        `update Employment set  
        Hire_Date = '${formattedHireDate}',
        Employment_Status = '${status}' 
        where Employee_ID = ${employeeId * 1}
        `
      );

      const departmentCode = department.departmentCode
        ? `'${department.departmentCode}'`
        : null;

      await request.query(
        `
        update Job_History set
        
        Department = '${department.department}',
        Departmen_Code = ${departmentCode ? departmentCode : null}
        where Employee_ID = ${employeeId * 1} and ID = ${department.ID * 1}
        `
      );

      return res.status(200).json("success");
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        data: [],
      });
    }
  }

  async createEmployee(req, res, next) {
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
      const employee = new EmployeeModel({
        employeeId,
        firstName,
        lastName,
        vacationDays: vocationDays,
        paidToDate,
        paidLastYear,
        birthDay: birthday,
      });
      const data = await employee.save();
      const request = new sql.Request();
      await request.query(`
          insert into 
          Personal(Employee_ID,First_Name,Last_Name,
            Gender,Shareholder_Status,Phone_Number,Email,Address1,Address2,
            Ethnicity,Benefit_Plans) 
            values('${employeeId}','${firstName}','${lastName}',${
        gender ? 1 : 0
      },${
        shareHolder ? 1 : 0
      },'${phoneNumber}','${email}','${address1}','${address2}',
            '${ethnicity}',${benifitPlan * 1}
          )
      `);
      const hireDateConvert = new Date(hireDate); // Assume you have the hire date in this variable
      const formattedHireDate = hireDateConvert.toISOString().slice(0, 10);
      await request.query(`
          insert into Employment(Employee_ID,Hire_Date,Employment_Status)
          values('${employeeId}','${formattedHireDate}', ${status ? 1 : 0})
      `);
      const departmentCode = department.departmentCode
        ? `${department.departmentCode}`
        : null;
      await request.query(`
          insert into Job_History(Employee_ID,Departmen_Code,Department)
          values('${employeeId}',${departmentCode},'${department.department}')
      `);
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new Employee();
