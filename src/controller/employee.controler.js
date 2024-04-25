const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { sipBaseUrl, hrBaseUrl } = require("../utils/baseURL");
const { fetchPost } = require("../utils/customFetch");

class Employee {
  async getEmployee(req, res, next) {
    try {
      const { limit = 5, page = 1 } = req.query;
      const sip = await fetch(
        sipBaseUrl + `/employee?limit=${limit}&page=${page}`
      );
      const { data: sipResponse, amount } = await sip.json();
      // const amount = (await sip.json());
      const hr = await fetch(hrBaseUrl + "/income/getall/all");
      const hrResponse = JSON.parse(await hr.json());
      const data = [];

      for (let j = 0; j < sipResponse.length; j++) {
        const item = sipResponse[j];

        for (let i = 0; i < hrResponse.length; i++) {
          const HR = hrResponse[i];

          if (
            item.employeeId.toString() === HR.Employee_ID.toString() &&
            item.firstName.toLowerCase() === HR.First_Name.toLowerCase() &&
            item.lastName.toLowerCase() === HR.Last_Name.toLowerCase()
          ) {
            // console.log(HR);
            data.push({
              employeeId: item.employeeId,
              fullName: `${item.firstName} ${item.lastName}`,
              firstName: item.firstName,
              lastName: item.lastName,
              gender: HR.Gender,
              ethnicity: HR.Ethnicity,
              paidToDay: item.paidToDate,
              paidLastYear: item.paidLastYear,
              department: HR.Job_History[0]?.Department,
              idDepartment: HR.Job_History[0]?.ID,
              status: HR.Employment?.Employment_Status,
              birthday: item.birthDay,
              vacationDays: item.vacationDays,
              hireDate: HR.Employment?.Hire_Date,
              departmentCode: HR.Employment?.Department_Code,
              address1: HR.Address1,
              address2: HR.Address2,
              email: HR.Email,
              phoneNumber: HR.PhoneNumber,
              benifitPlan: HR.Benefit_Plans1,
              shareHolder: HR.Shareholder_Status,
            });
          }
        }
      }
      return res.status(200).json({
        data,
        amount,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: [],
      });
    }
  }
  async getBirthday(req, res, next) {
    try {
      const { limit = 5, page = 1 } = req.query;
      const month = new Date().getMonth() + 1;

      const sip = await fetch(
        sipBaseUrl +
          `/employee/birthday?limit=${limit}&page=${page}&month=${month}`
      );
      const { data: sipReponse, amount } = await sip.json();
      const hr = await fetch(hrBaseUrl + "/income/getall/all");
      const hrResponse = JSON.parse(await hr.json());
      const data = [];
      for (let j = 0; j < sipReponse.length; j++) {
        const item = sipReponse[j];

        for (let i = 0; i < hrResponse.length; i++) {
          const HR = hrResponse[i];

          if (
            item.employeeId.toString() === HR.Employee_ID.toString() &&
            item.firstName.toLowerCase() === HR.First_Name.toLowerCase() &&
            item.lastName.toLowerCase() === HR.Last_Name.toLowerCase()
          ) {
            data.push({
              fullName: `${item.firstName + item.lastName}`,
              gender: HR.Gender,
              ethnicity: HR.Ethnicity,
              birthday: item.birthDay,
              department: HR.Job_History[0].Department,
            });
          }
        }
      }
      return res.status(200).json({ data, amount });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: [],
      });
    }
  }
  async averagePlan(req, res, next) {
    try {
      const sip = await fetch(sipBaseUrl + `/employee?limit=${0}`);
      const sipResponse = (await sip.json()).data;
      const hr = await fetch(hrBaseUrl + "/income/getall/all");
      const hrResponse = JSON.parse(await hr.json());
      let data = [];
      for (let j = 0; j < sipResponse.length; j++) {
        const item = sipResponse[j];

        for (let i = 0; i < hrResponse.length; i++) {
          const HR = hrResponse[i];

          if (
            item.employeeId.toString() === HR.Employee_ID.toString() &&
            item.firstName.toLowerCase() === HR.First_Name.toLowerCase() &&
            item.lastName.toLowerCase() === HR.Last_Name.toLowerCase()
          ) {
            data.push({ ...HR, ...item });
          }
        }
      }

      const typeBenifit = {};
      data.forEach((item) => {
        const benifit = item.Benefit_Plans1;
        if (benifit) {
          // console.log(item);
          typeBenifit[benifit.Plan_Name] = typeBenifit[benifit.Plan_Name]
            ? typeBenifit[benifit.Plan_Name] + item.paidToDate
            : item.paidToDate;
        }
      });
      const dataBenifit = [];
      for (const item in typeBenifit) {
        dataBenifit.push({ plan: item, paid: typeBenifit[item] });
      }
      return res.status(200).json(dataBenifit);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: [],
      });
    }
  }

  async hireDay(req, res, next) {
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
      const date = `${day}-${month}`;
      const hr = await fetch(hrBaseUrl + "/income/GetHireDate/" + date);
      const hrResponse = JSON.parse(await hr.json());
      const data = hrResponse.map((item) => ({
        fullName: item.First_Name + " " + item.Last_Name,
        gender: item.Gender,
        id: item.Employment.Employee_ID,
        hireDay: item.Employment.Hire_Date,
      }));
      return res.status(200).json(data);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: [],
      });
    }
  }
  async vocationDay(req, res) {
    try {
      const { limit = 5, page = 1 } = req.query;
      const sip = await fetch(
        sipBaseUrl + `/employee?limit=${limit}&page=${page}`
      );
      const { data: sipResponse, amount } = await sip.json();
      const hr = await fetch(hrBaseUrl + "/income/getall/all");
      const hrResponse = JSON.parse(await hr.json());
      const data = [];
      for (let j = 0; j < sipResponse.length; j++) {
        const item = sipResponse[j];

        for (let i = 0; i < hrResponse.length; i++) {
          const HR = hrResponse[i];

          if (
            item.employeeId.toString() === HR.Employee_ID.toString() &&
            item.firstName.toLowerCase() === HR.First_Name.toLowerCase() &&
            item.lastName.toLowerCase() === HR.Last_Name.toLowerCase()
          ) {
            data.push({
              employeeId: item.employeeId,
              fullName: `${item.firstName} ${item.lastName}`,
              firstName: item.firstName,
              lastName: item.lastName,
              gender: HR.Gender,
              ethnicity: HR.Ethnicity,
              paidToDay: item.paidToDate,
              paidLastYear: item.paidLastYear,
              department: HR.Job_History[0]?.Department,
              idDepartment: HR.Job_History[0]?.ID,
              status: HR.Employment?.Employment_Status,
              birthday: item.birthDay,
              vacationDays: item.vacationDays,
              hireDate: HR.Employment?.Hire_Date,
              departmentCode: HR.Employment?.Department_Code,
              shareHolder: HR.Shareholder_Status,
            });
          }
        }
      }
      return res.status(200).json({ data, amount });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: [],
      });
    }
  }
  async deleteEmployee(req, res) {
    try {
      const { id, employeeId } = req.body;
      await fetchPost(sipBaseUrl + "/employee/delete", {
        id: employeeId,
      });
      await fetchPost(hrBaseUrl + "/Income/DeleteEmployment/" + employeeId * 1);
      await fetchPost(hrBaseUrl + "/Income/DeleteJobHistory/" + id);
      await fetchPost(hrBaseUrl + "/Income/DeletePersonal/" + employeeId * 1);

      return res.status(200).json("success");
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        data: [],
      });
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
      // console.log(shareHolder ? 1 : 0);
      const sip = await fetchPost(sipBaseUrl + "/employee/edit", {
        employeeId: employeeId.toString(),
        firstName: firstName,
        lastName: lastName,
        vacationDays: vocationDays,
        paidLastYear,
        paidToDate,
        birthDay: birthday,
      });
      const dataSip = await sip.json();
      const hr = await fetchPost(hrBaseUrl + "/Income/EditPersonal/all", {
        Employee_ID: employeeId,
        First_Name: firstName,
        Last_Name: lastName,
        Gender: gender,
        Ethnicity: ethnicity,
        Address1: address1,
        Address2: address2,
        Email: email,
        PhoneNumber: phoneNumber,
        Benefit_Plans: benifitPlan.Benefit_Plan_ID,
        Shareholder_Status: shareHolder ? 1 : 0,
      });
      const hrE = await fetchPost(hrBaseUrl + "/Income/EditEmployment/all", {
        Employee_ID: employeeId,
        Hire_Date: hireDate,
        Employment_Status: status,
      });
      const hrD = await fetchPost(hrBaseUrl + "/Income/EditJobHistory/all", {
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
      return res.status(500).json({
        success: false,
        message: error.message,
        data: [],
      });
    }
  }
}

module.exports = new Employee();
