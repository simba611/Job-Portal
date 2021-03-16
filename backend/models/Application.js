const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Create Schema
const ApplicationSchema = new Schema({
  app_id: {
    type: String,
    required: true,
  },
  job_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Applied",
  },
  sop: {
    type: String,
  },
  date_of_apply: {
    type: Date,
    default: Date.now,
  },
  date_of_joining:{
    type: Date,
  }
});
module.exports = Application = mongoose.model(
  "applications",
  ApplicationSchema
);
