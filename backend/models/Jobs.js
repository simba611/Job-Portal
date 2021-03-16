const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Create Schema
const JobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  rec_id: {
    type: String,
    required: true,
  },
  max_application: {
    type: Number,
    required: true,
  },
  max_position: {
    type: Number,
    required: true,
  },
  accepted: {
    type: [String],
  },
  date_posting: {
    type: Date,
    default: Date.now,
  },
  date_deadline: {
    type: Date,
    required: true,
  },
  skill_set: {
    type: String,
    required: true,
  },
  job_type: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
    min: 1,
  },
  rating: {
    type: [Number],
    default: 0,
  },
  app_rating: {
    type: [String],
  },
  is_full: {
    type: Boolean,
    default: false,
  },
  num_app: {
    type: Number,
    default: 0,
  },
  applicants: {
    type: [String],
  },
  num_joined: {
    type: Number,
    default: 0,
  },
  joined_applicants: {
    type: [String],
  },
});
module.exports = Job = mongoose.model("jobs", JobSchema);
