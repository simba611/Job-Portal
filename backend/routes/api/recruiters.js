const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const Recruiter = require("../../models/Recruiter");
const User = require("../../models/User");
var ObjectId = require("mongodb").ObjectID;
const Validator = require("validator");
const isEmpty = require("is-empty");
const Jobs = require("../../models/Jobs");
const Application = require("../../models/Application");

function countWords(str) {
  return str.split(/\s+/).length;
}

router.post("/change_name", (req, res) => {
  if (!isEmpty(req.body.name)) {
    User.updateOne({ _id: ObjectId(req.body.id) }, { name: req.body.name })
      .then((user) => {
        return res.status(200).json(user);
      })
      .catch((err) => {
        return res.status(400).json(err);
      });
  } else {
    return res.status(400).json({ error: "Enter a name" });
  }
});

router.post("/change_email", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (isEmpty(user)) {
      if (isEmpty(req.body.email)) {
        req.body.email = "";
      }
      if (Validator.isEmail(req.body.email)) {
        User.updateOne(
          { _id: ObjectId(req.body.id) },
          { email: req.body.email }
        )
          .then((user) => {
            return res.status(200).json(user);
          })
          .catch((err) => {
            return res.status(400).json(err);
          });
      } else {
        return res.status(400).json({ error: "Not a valid email" });
      }
    } else {
      return res.status(400).json({ error: "email taken" });
    }
  });
});

router.post("/change_contact", (req, res) => {
  Recruiter.updateOne(
    { ref_id: ObjectId(req.body.id) },
    { contact: req.body.contact }
  ).then((user) => {
    return res.status(200).json(user);
  });
});

router.post("/change_bio", (req, res) => {
  if (countWords(req.body.bio) <= 250) {
    Recruiter.updateOne(
      { ref_id: ObjectId(req.body.id) },
      { bio: req.body.bio }
    ).then((user) => {
      return res.status(200).json(user);
    });
  } else {
    return res.status(400).json({ error: "Bio too long" });
  }
});

router.post("/get_profile", (req, res) => {
  Recruiter.findOne({ ref_id: ObjectId(req.body.id) }).then((user) => {
    return res.status(200).json(user);
  });
});

router.post("/get_email", (req, res) => {
  User.findOne({ _id: ObjectId(req.body.id) }).then((user) => {
    return res.status(200).json(user);
  });
});

router.post("/active_list", (req, res) => {
  Jobs.find(
    {
      rec_id: req.body.rec_id,
      $where: function () {
        return this.accepted.length < this.max_position;
      },
    }
    // accepted: { $size: { $lt: { $max_position } } },
  ).then((arr) => {
    return res.status(200).json(arr);
  });
});

router.post("/employees", (req, res) => {
  Application.aggregate([
    {
      $addFields: { job_id2: { $toObjectId: "$job_id" } },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "job_id2",
        foreignField: "_id",
        as: "job_app",
      },
    },
    {
      $unwind: "$job_app",
    },
    {
      $match: { "job_app.rec_id": req.body.rec_id },
    },
    {
      $match: { status: "Accepted" },
    },
    {
      $lookup: {
        from: "applicants",
        localField: "app_id",
        foreignField: "ref_id",
        as: "applicant",
      },
    },
    {
      $unwind: "$applicant",
    },
    {
      $addFields: {user_id: {$toObjectId: "$applicant.ref_id"}}
    },
    {
      $lookup:{
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "also_name",
      }
    },
    {
      $unwind: "$also_name"
    }
  ]).then((i) => {
    return res.status(200).json(i);
  });
});

// router.post("/kk", (req, res) => {
//   Jobs.updateOne(
//     {
//       _id: ObjectId(req.body.id),
//     },
//     { $push: { accepted: "hello" } }
//   ).then((r) => {
//     return res.status(200).json(r);
//   });
// });

module.exports = router;
