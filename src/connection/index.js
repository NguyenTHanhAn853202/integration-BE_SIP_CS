const mongoose = require("mongoose");
const mssql = require("mssql");
const sql = require("mssql/msnodesqlv8");

async function connect() {
  try {
    const config = {
      server: "LAPTOP-2A8I63E5\\SQLEXPRESS",
      user: "thanhan123",
      password: "thanhan123",
      database: "HR",
      options: {
        encrypt: false,
      },
    };
    await mongoose.connect("mongodb://127.0.0.1:27017/apicompany");
    console.log("connect successfully");
    await sql.connect(config);
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = { connect, mssql };
