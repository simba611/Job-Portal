const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Create Schema
const RecruiterSchema = new Schema({
  ref_id: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
  },
  bio: {
    type: String,
  },
});
module.exports = Applicant = mongoose.model("recruiters", RecruiterSchema);
