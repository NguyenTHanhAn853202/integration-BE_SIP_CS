const { hrBaseUrl, sipBaseUrl } = require("../utils/baseURL");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const fetchPost = async (url, options) => {
  try {
    return await fetch(url, {
      method: "POST",
      body: JSON.stringify(options),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { fetchPost };
