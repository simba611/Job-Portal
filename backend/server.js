const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 4000;
const DB_NAME = "tutorial";
const passport = require("passport");
const users = require("./routes/api/users");
const api_jobs = require("./routes/api/api_jobs");
const applicants = require("./routes/api/applicants");
const recruiters = require("./routes/api/recruiters");
const applications = require("./routes/api/applications");
// routes
// var testAPIRouter = require("./routes/testAPI");
// var UserRouter = require("./routes/Users");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/" + DB_NAME, {
  useNewUrlParser: true,
});
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully !");
});

// Passport middleware
app.use(passport.initialize()); // Passport config
require("./config/passport")(passport); // Routes
app.use("/api/users", users);
app.use("/api/api_jobs", api_jobs);
app.use("/api/applicants", applicants);
app.use("/api/recruiters", recruiters);
app.use("/api/applications", applications);

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
