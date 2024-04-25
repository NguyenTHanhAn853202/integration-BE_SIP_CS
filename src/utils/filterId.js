const filterId = (data) => {
  const id = data.map((item) => item.employeeId);
  return id;
};

module.exports = filterId;
