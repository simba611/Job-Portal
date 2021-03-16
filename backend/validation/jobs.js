const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateJobInput(data) {
  let errors = {};
  if (isEmpty(data.title)) {
    errors.title = "Title is absent";
  }
  if (isEmpty(data.max_application)) {
    errors.max_application = "Max application field is required";
  }
  if (isEmpty(data.max_position)) {
    errors.max_position = "Max position field is required";
  } else if (data.max_position <= 0) {
    errors.max_position = "Max positions must be a positive integer";
  }
  if (isEmpty(data.date_deadline)) {
    errors.date_deadline = "Deadline date is empty";
  } else {
      var d1 = new Date(data.date_deadline)
      var d2 = new Date()
    if (d1.getTime() <= d2.getTime()) {
      errors.date_deadline = "Deadline in past";
    }
  }
  if (isEmpty(data.job_type)) {
    errors.job_type = "Job type is empty";
  }
  if (isEmpty(data.salary)) {
    data.salary = 0;
    errors.salary = "Salary is empty";
  }
  if (data.max_application <= 0) {
    errors.max_application = "Max applications must be a positive integer";
  }
  if (data.salary <= 0) {
    errors.salary = "Salary has to be positive";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
