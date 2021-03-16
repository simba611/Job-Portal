const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const Applicant = require("../../models/Applicant");
const User = require("../../models/User");
var ObjectId = require("mongodb").ObjectID;
const Validator = require("validator");
const isEmpty = require("is-empty");
const Jobs = require("../../models/Jobs");
const Recruiter = require("../../models/Recruiter");
const Application = require("../../models/Application");

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

router.post("/add_skill", (req, res) => {
  if (!isEmpty(req.body.skill)) {
    Applicant.find({
      $and: [{ ref_id: req.body.id }, { skills: req.body.skill }],
    }).then((found) => {
      if (isEmpty(found)) {
        Applicant.updateOne(
          { ref_id: ObjectId(req.body.id) },
          { $push: { skills: req.body.skill } }
        )
          .then((user) => {
            return res.status(200).json(user);
          })
          .catch((err) => {
            return res.status(400).json(err);
          });
      } else {
        return res.status(400).json({ error: "Already exists" });
      }
    });
  } else {
    return res.status(400).json({ error: "Enter a skill" });
  }
});

router.post("/remove_skill", (req, res) => {
  Applicant.updateOne(
    { ref_id: req.body.id },
    { $pull: { skills: req.body.skill } }
  )
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post("/add_education", (req, res) => {
  if (isEmpty(req.body.edu_name) || isEmpty(req.body.start_date)) {
    return res.status(400).json({ error: "Incomplete" });
  } else {
    if (isEmpty(req.body.end_date)) {
      Applicant.updateOne(
        { ref_id: req.body.id },
        {
          $push: {
            education: {
              edu_name: req.body.edu_name,
              start_date: req.body.start_date,
            },
          },
        }
      ).then((user) => {
        return res.status(200).json(user);
      });
    } else {
      Applicant.updateOne(
        { ref_id: req.body.id },
        {
          $push: {
            education: {
              edu_name: req.body.edu_name,
              start_date: req.body.start_date,
              end_date: req.body.end_date,
            },
          },
        }
      ).then((user) => {
        return res.status(200).json(user);
      });
    }
  }
});

router.post("/remove_education", (req, res) => {
  Applicant.updateOne(
    { ref_id: req.body.id },
    { $pull: { education: { _id: ObjectId(req.body.edu_id) } } }
  )
    .then((up) => {
      return res.status(200).json(up);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

router.post("/get_profile", (req, res) => {
  Applicant.findOne({ ref_id: ObjectId(req.body.id) }).then((app) => {
    return res.status(200).json(app);
  });
});

router.post("/get_email", (req, res) => {
  User.findOne({ _id: ObjectId(req.body.id) }).then((user) => {
    return res.status(200).json(user);
  });
});

router.post("/my_applications", (req, res) => {
  Jobs.aggregate([
    {
      $project: {
        _id: {
          $toString: "$_id",
        },
        title: 1,
        date_posting: 1,
        salary: 1,
        status: 1,
        rec_id: 1,
        app_rating: 1,
      },
    },
    {
      $lookup: {
        from: "applications",
        localField: "_id",
        foreignField: "job_id",
        as: "job_app",
      },
    },
    {
      $unwind: "$job_app",
    },
    {
      $match: { "job_app.app_id": req.body.app_id },
    },
    {
      $addFields: { rec_id2: { $toObjectId: "$rec_id" } },
    },
    {
      $lookup: {
        from: "users",
        localField: "rec_id2",
        foreignField: "_id",
        as: "final",
      },
    },
    {
      $unwind: "$final",
    },
  ]).then((stuff) => {
    return res.status(200).json(stuff);
  });
});

router.post("/part_app", (req, res) => {
  Application.aggregate([
    {
      $match: { job_id: req.body.job_id },
    },
    {
      $lookup: {
        from: "applicants",
        localField: "app_id",
        foreignField: "ref_id",
        as: "all_app",
      },
    },
    {
      $unwind: "$all_app",
    },
    {
      $addFields: { ref_id2: { $toObjectId: "$all_app.ref_id" } },
    },
    {
      $lookup: {
        from: "users",
        localField: "ref_id2",
        foreignField: "_id",
        as: "also",
      },
    },
    {
      $unwind: "$also",
    },
    {
      $match: { status: { $nin: ["Rejected"] } },
    },
  ]).then((stuff) => {
    return res.status(200).json(stuff);
  });
});

router.post("/shortlist", (req, res) => {
  Application.aggregate([
    {
      $lookup: {
        from: "applicants",
        localField: "app_id",
        foreignField: "ref_id",
        as: "all_app",
      },
    },
    {
      $unwind: "$all_app",
    },
    {
      $match: { _id: ObjectId(req.body.app_id) },
    },
  ]).then((found) => {
    console.log(found);
    if (found[0].all_app.employed == false) {
      Application.updateOne(
        { _id: ObjectId(req.body.app_id) },
        { status: "Shortlisted" }
      ).then((y) => {
        return res.status(200).json(y);
      });
    } else {
      return res.status(400).json({ err: "Refresh page" });
    }
  });
});

router.post("/reject", (req, res) => {
  Application.updateOne(
    { _id: ObjectId(req.body.app_id) },
    { status: "Rejected" }
  ).then((y) => {
    Applicant.updateOne(
      { ref_id: req.body.applicant_id },
      { $inc: { no_applications: -1 } }
    ).then((r) => {
      // Jobs.updateOne(
      //   { _id: ObjectId(req.body.job_id) },
      //   {
      //     $inc: { num_app: -1 },
      //     $pull: { applicants: { $in: [req.body.applicant_id] } },
      //   }
      // ).then((h) => {
      return res.status(200).json(r);
      // });
    });
    // return res.status(200).json(y);
  });
});

router.post("/accept", (req, res) => {
  Application.aggregate([
    {
      $lookup: {
        from: "applicants",
        localField: "app_id",
        foreignField: "ref_id",
        as: "all_app",
      },
    },
    {
      $unwind: "$all_app",
    },
    {
      $match: { _id: ObjectId(req.body.app_id) },
    },
  ]).then((found) => {
    console.log(found);
    if (found[0].all_app.employed == false) {
      console.log("here");
      Application.updateOne(
        { _id: ObjectId(req.body.app_id) },
        { status: "Accepted", date_of_joining: Date.now() }
      ).then((y) => {
        console.log("here2");
        Jobs.updateOne(
          { _id: ObjectId(found[0].job_id) },
          { $push: { accepted: found[0].app_id } }
        ).then((u) => {
          Application.updateMany(
            {
              app_id: found[0].app_id,
              _id: { $nin: [ObjectId(req.body.app_id)] },
            },
            { status: "Rejected" }
          ).then((p) => {
            Applicant.updateOne(
              { ref_id: found[0].app_id },
              { employed: true }
            ).then((oo) => {
              return res.status(200).json(oo);
            });
          });
        });
      });
    } else {
      return res.status(400).json({ err: "Refresh page" });
    }
  });
});

router.post("/rate_app", (req, res) => {
  Applicant.updateOne(
    { ref_id: req.body.app_id },
    { $push: { rating: req.body.rating, who_rated: req.body.rec_id } }
  )
    .then((r) => {
      res.status(200).json(r);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

module.exports = router;
