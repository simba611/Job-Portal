const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const Applicant = require("../../models/Applicant");
const User = require("../../models/User");
const Application = require("../../models/Application");
var ObjectId = require("mongodb").ObjectID;
const Validator = require("validator");
const isEmpty = require("is-empty");
const Job = require("../../models/Jobs");

router.post("/create_application", (req, res) => {
  Job.findOne({ _id: req.body.job_id }).then((job) => {
    if (!isEmpty(job)) {
      var d1 = new Date(job.date_deadline);
      var d2 = new Date();
      if (
        d1.getTime() > d2.getTime() &&
        job.max_application > job.num_app &&
        job.max_position > job.accepted.length
      ) {
        Applicant.findOne({ ref_id: req.body.app_id }).then((user) => {
          console.log(user);
          if (user.no_applications < 10 && user.employed==false) {
            const new_application = new Application({
              app_id: req.body.app_id,
              job_id: req.body.job_id,
              sop: req.body.sop,
            })
              .save()
              .then((app) => {
                Applicant.updateOne(
                  { ref_id: ObjectId(req.body.app_id) },
                  { $inc: { no_applications: 1, "metric.orders": 1 } }
                ).then((uu) => {
                  console.log(uu);
                });
                Job.updateOne(
                  { _id: ObjectId(req.body.job_id) },
                  {
                    $inc: {
                      num_app: 1,
                      "metric.orders": 1,
                    },
                    $push: {
                      applicants: req.body.app_id,
                    },
                  }
                ).then((yy) => {
                  console.log(yy);
                });
                return res.status(200).json(app);
              });
          } else {
            return res
              .status(400)
              .json({ application_limit: "Cannot apply to more than 10 jobs" });
          }
        });
      } else {
        return res
          .status(400)
          .json({ deadline: "Deadline for this application has passed" });
      }
    } else {
      return res.status(400).json({ deadline: "Anything" });
    }
  });
});

router.post("/has_applied", (req, res) => {
  Application.findOne({ job_id: req.body.job_id, app_id: req.body.app_id })
    .then((jobs) => {
      if (!isEmpty(jobs)) {
        return res.status(200).json({ stat: true });
      } else {
        return res.status(200).json({ stat: false });
      }
    })
    .catch((err) => {
      return err.status(400).json(err);
    });
});

module.exports = router;
