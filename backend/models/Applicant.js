const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Create Schema
const ApplicantSchema = new Schema({
  ref_id: {
    type: String,
    required: true,
  },
  education: [
    {
      edu_name: { type: String },
      start_date: { type: Date },
      end_date: { type: Date },
      required: false,
    },
  ],
  skills: {
    type: [String],
  },
  rating: {
    type: [Number],
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  no_applications: {
    type: Number,
    default: 0,
  },
  employed: {
    type: Boolean,
    default: false,
  },
  who_rated: {
    type: [String],
  },
});
module.exports = Applicant = mongoose.model("applicants", ApplicantSchema);
