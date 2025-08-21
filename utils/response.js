// utils/response.js

const successResponse = (
  res,
  data = {},
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    status: "success",
    data,
    message,
  });
};

const errorResponse = (res, message = "Error", statusCode = 500, data = {}) => {
  return res.status(statusCode).json({
    status: "error",
    data,
    message,
  });
};

module.exports = { successResponse, errorResponse };
