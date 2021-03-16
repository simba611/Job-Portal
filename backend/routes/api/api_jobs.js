const express = require("express");
const router = express.Router();
const isEmpty = require("is-empty");
const Jobs = require("../../models/Jobs");
const Job = require("../../models/Jobs");
const Recruiter = require("../../models/Recruiter");
const validateJobInput = require("../../validation/jobs");
const User = require("../../models/User");
const Application = require("../../models/Application");
const Applicants = require("../../models/Applicant");
var ObjectId = require("mongodb").ObjectID;

router.get("/send_all", (req, res) => {
  User.aggregate([
    {
      $project: {
        _id: {
          $toString: "$_id",
        },
        name: 1,
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "_id",
        foreignField: "rec_id",
        as: "all_jobs",
      },
    },
    {
      $unwind: "$all_jobs",
    },
    {
      $match: { "all_jobs.date_deadline": { $gte: new Date() } },
    },
  ]).then((jobs) => {
    return res.status(200).json(jobs);
  });

  // Job.find({})
  //   .then((jobs) => {
  //     return res.status(200).json(jobs);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

router.post("/add_job", (req, res) => {
  const { errors, isValid } = validateJobInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const newJob = new Job({
    title: req.body.title,
    rec_id: req.body.id,
    max_application: req.body.max_application,
    max_position: req.body.max_position,
    date_deadline: req.body.date_deadline,
    skill_set: req.body.skill_set,
    job_type: req.body.job_type,
    duration: req.body.duration,
    salary: req.body.salary,
  });
  newJob
    .save()
    .then((job) => res.status(200).json(job))
    .catch((err) => console.log(err));
});

router.post("/filter_type", (req, res) => {
  Job.find({ job_type: req.body.job_type }).then((jobs) => {
    return res.status(200).json(jobs);
  });
});

router.post("/filter_salary", (req, res) => {
  Job.find({
    $and: [
      { salary: { $gte: req.body.min } },
      { salary: { $lte: req.body.max } },
    ],
  }).then((jobs) => {
    return res.status(200).json(jobs);
  });
});

router.post("/filter_duration", (req, res) => {
  Job.find({ duration: { $lt: req.body.duration } }).then((jobs) => {
    return res.status(200).json(jobs);
  });
});

// router.post("/filter", (req, res) => {
//   const final_jobs = {};
//   if (
//     !isEmpty(req.body.duration) &&
//     isEmpty(req.body.min) &&
//     isEmpty(req.body.max) &&
//     isEmpty(req.body.job_type)
//   ) {
//     Job.find({ duration: { $lt: req.body.duration } }).then((jobs) => {
//       return res.status(200).json(jobs);
//     });
//   } else if (
//     isEmpty(req.body.duration) &&
//     (!isEmpty(req.body.min) || !isEmpty(req.body.max)) &&
//     isEmpty(req.body.job_type)
//   ) {
//     if (isEmpty(req.body.min)) {
//       req.body.min = 0;
//     }
//     if (isEmpty(req.body.max)) {
//       req.body.max = 1000000000;
//     }
//     Job.find({
//       $and: [
//         { salary: { $gte: req.body.min } },
//         { salary: { $lte: req.body.max } },
//       ],
//     }).then((jobs) => {
//       return res.status(200).json(jobs);
//     });
//   } else if (
//     isEmpty(req.body.duration) &&
//     isEmpty(req.body.min) &&
//     isEmpty(req.body.max) &&
//     !isEmpty(req.body.job_type)
//   ) {
//     Job.find({ job_type: req.body.job_type }).then((jobs) => {
//       return res.status(200).json(jobs);
//     });
//   } else if (
//     !isEmpty(req.body.duration) &&
//     isEmpty(req.body.min) &&
//     isEmpty(req.body.max) &&
//     !isEmpty(req.body.job_type)
//   ) {
//     Job.find({
//       $and: [
//         { duration: { $lt: req.body.duration } },
//         { job_type: req.body.job_type },
//       ],
//     }).then((jobs) => {
//       return res.status(200).json(jobs);
//     });
//   } else if (
//     isEmpty(req.body.duration) &&
//     (!isEmpty(req.body.min) || !isEmpty(req.body.max)) &&
//     !isEmpty(req.body.job_type)
//   ) {
//     if (isEmpty(req.body.min)) {
//       req.body.min = 0;
//     }
//     if (isEmpty(req.body.max)) {
//       req.body.max = 1000000000;
//     }
//     Job.find({
//       $and: [
//         { salary: { $gte: req.body.min } },
//         { salary: { $lte: req.body.max } },
//         { job_type: req.body.job_type },
//       ],
//     }).then((jobs) => {
//       return res.status(200).json(jobs);
//     });
//   } else if (
//     !isEmpty(req.body.duration) &&
//     (!isEmpty(req.body.min) || !isEmpty(req.body.max)) &&
//     isEmpty(req.body.job_type)
//   ) {
//     if (isEmpty(req.body.min)) {
//       req.body.min = 0;
//     }
//     if (isEmpty(req.body.max)) {
//       req.body.max = 1000000000;
//     }
//     Job.find({
//       $and: [
//         { salary: { $gte: req.body.min } },
//         { salary: { $lte: req.body.max } },
//         { duration: { $lt: req.body.duration } },
//       ],
//     }).then((jobs) => {
//       return res.status(200).json(jobs);
//     });
//   } else if (
//     !isEmpty(req.body.duration) &&
//     (!isEmpty(req.body.min) || !isEmpty(req.body.max)) &&
//     !isEmpty(req.body.job_type)
//   ) {
//     if (isEmpty(req.body.min)) {
//       req.body.min = 0;
//     }
//     if (isEmpty(req.body.max)) {
//       req.body.max = 1000000000;
//     }
//     Job.find({
//       $and: [
//         { salary: { $gte: req.body.min } },
//         { salary: { $lte: req.body.max } },
//         { duration: { $lt: req.body.duration } },
//         { job_type: req.body.job_type },
//       ],
//     }).then((jobs) => {
//       return res.status(200).json(jobs);
//     });
//   } else {
//     Jobs.find({}).then((jobs) => {
//       return res.status(200).json(jobs);
//     });
//   }
// });

router.post("/filter", (req, res) => {
  const final_jobs = {};
  if (
    !isEmpty(req.body.duration) &&
    isEmpty(req.body.min) &&
    isEmpty(req.body.max) &&
    isEmpty(req.body.job_type)
  ) {
    User.aggregate([
      {
        $project: {
          _id: {
            $toString: "$_id",
          },
          name: 1,
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "rec_id",
          as: "all_jobs",
        },
      },
      {
        $unwind: "$all_jobs",
      },
      {
        $match: {
          $and: [
            { "all_jobs.duration": { $lt: req.body.duration } },
            { "all_jobs.date_deadline": { $gte: new Date() } },
          ],
        },
      },
    ]).then((jobs) => {
      return res.status(200).json(jobs);
    });
  } else if (
    isEmpty(req.body.duration) &&
    (!isEmpty(req.body.min) || !isEmpty(req.body.max)) &&
    isEmpty(req.body.job_type)
  ) {
    if (isEmpty(req.body.min)) {
      req.body.min = 0;
    }
    if (isEmpty(req.body.max)) {
      req.body.max = 1000000000;
    }
    User.aggregate([
      {
        $project: {
          _id: {
            $toString: "$_id",
          },
          name: 1,
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "rec_id",
          as: "all_jobs",
        },
      },
      {
        $unwind: "$all_jobs",
      },
      {
        $match: {
          $and: [
            { "all_jobs.salary": { $gte: req.body.min } },
            { "all_jobs.salary": { $lte: req.body.max } },
            { "all_jobs.date_deadline": { $gte: new Date() } },
          ],
        },
      },
    ]).then((jobs) => {
      return res.status(200).json(jobs);
    });
  } else if (
    isEmpty(req.body.duration) &&
    isEmpty(req.body.min) &&
    isEmpty(req.body.max) &&
    !isEmpty(req.body.job_type)
  ) {
    User.aggregate([
      {
        $project: {
          _id: {
            $toString: "$_id",
          },
          name: 1,
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "rec_id",
          as: "all_jobs",
        },
      },
      {
        $unwind: "$all_jobs",
      },
      {
        $match: {
          $and: [
            { "all_jobs.job_type": req.body.job_type },
            { "all_jobs.date_deadline": { $gte: new Date() } },
          ],
        },
      },
    ]).then((jobs) => {
      return res.status(200).json(jobs);
    });
  } else if (
    !isEmpty(req.body.duration) &&
    isEmpty(req.body.min) &&
    isEmpty(req.body.max) &&
    !isEmpty(req.body.job_type)
  ) {
    User.aggregate([
      {
        $project: {
          _id: {
            $toString: "$_id",
          },
          name: 1,
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "rec_id",
          as: "all_jobs",
        },
      },
      {
        $unwind: "$all_jobs",
      },
      {
        $match: {
          $and: [
            { "all_jobs.duration": { $lt: req.body.duration } },
            { "all_jobs.job_type": req.body.job_type },
            { "all_jobs.date_deadline": { $gte: new Date() } },
          ],
        },
      },
    ]).then((jobs) => {
      return res.status(200).json(jobs);
    });
  } else if (
    isEmpty(req.body.duration) &&
    (!isEmpty(req.body.min) || !isEmpty(req.body.max)) &&
    !isEmpty(req.body.job_type)
  ) {
    if (isEmpty(req.body.min)) {
      req.body.min = 0;
    }
    if (isEmpty(req.body.max)) {
      req.body.max = 1000000000;
    }
    User.aggregate([
      {
        $project: {
          _id: {
            $toString: "$_id",
          },
          name: 1,
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "rec_id",
          as: "all_jobs",
        },
      },
      {
        $unwind: "$all_jobs",
      },
      {
        $match: {
          $and: [
            { "all_jobs.salary": { $gte: req.body.min } },
            { "all_jobs.salary": { $lte: req.body.max } },
            { "all_jobs.job_type": req.body.job_type },
            { "all_jobs.date_deadline": { $gte: new Date() } },
          ],
        },
      },
    ]).then((jobs) => {
      return res.status(200).json(jobs);
    });
  } else if (
    !isEmpty(req.body.duration) &&
    (!isEmpty(req.body.min) || !isEmpty(req.body.max)) &&
    isEmpty(req.body.job_type)
  ) {
    if (isEmpty(req.body.min)) {
      req.body.min = 0;
    }
    if (isEmpty(req.body.max)) {
      req.body.max = 1000000000;
    }
    User.aggregate([
      {
        $project: {
          _id: {
            $toString: "$_id",
          },
          name: 1,
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "rec_id",
          as: "all_jobs",
        },
      },
      {
        $unwind: "$all_jobs",
      },
      {
        $match: {
          $and: [
            { "all_jobs.salary": { $gte: req.body.min } },
            { "all_jobs.salary": { $lte: req.body.max } },
            { "all_jobs.duration": { $lt: req.body.duration } },
            { "all_jobs.date_deadline": { $gte: new Date() } },
          ],
        },
      },
    ]).then((jobs) => {
      return res.status(200).json(jobs);
    });
  } else if (
    !isEmpty(req.body.duration) &&
    (!isEmpty(req.body.min) || !isEmpty(req.body.max)) &&
    !isEmpty(req.body.job_type)
  ) {
    if (isEmpty(req.body.min)) {
      req.body.min = 0;
    }
    if (isEmpty(req.body.max)) {
      req.body.max = 1000000000;
    }
    User.aggregate([
      {
        $project: {
          _id: {
            $toString: "$_id",
          },
          name: 1,
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "rec_id",
          as: "all_jobs",
        },
      },
      {
        $unwind: "$all_jobs",
      },
      {
        $match: {
          $and: [
            { "all_jobs.salary": { $gte: req.body.min } },
            { "all_jobs.salary": { $lte: req.body.max } },
            { "all_jobs.duration": { $lt: req.body.duration } },
            { "all_jobs.job_type": req.body.job_type },
            { "all_jobs.date_deadline": { $gte: new Date() } },
          ],
        },
      },
    ]).then((jobs) => {
      return res.status(200).json(jobs);
    });
  } else {
    User.aggregate([
      {
        $project: {
          _id: {
            $toString: "$_id",
          },
          name: 1,
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "rec_id",
          as: "all_jobs",
        },
      },
      {
        $unwind: "$all_jobs",
      },
      { $match: { "all_jobs.date_deadline": { $gte: new Date() } } },
    ]).then((jobs) => {
      return res.status(200).json(jobs);
    });
  }
});

// router.post("/filter", (req, res) => {
//   Job.find({
//     $and: [
//       { salary: { $gte: req.body.min } },
//       { salary: { $lte: req.body.max } },
//     ],
//   })
//     .find({ duration: { $lt: req.body.duration } })
//     .find({ job_type: req.body.job_type })
//     .then((jobs) => {
//       return res.status(200).json(jobs);
//     });
// });

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.post("/job_search", (req, res) => {
  if (isEmpty(req.body.search)) {
    req.body.search = "";
  }
  const regex = new RegExp(escapeRegex(req.body.search), "gi");
  User.aggregate([
    {
      $project: {
        _id: {
          $toString: "$_id",
        },
        name: 1,
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "_id",
        foreignField: "rec_id",
        as: "all_jobs",
      },
    },
    {
      $unwind: "$all_jobs",
    },
    {
      $match: {
        $and: [
          {
            "all_jobs.title": regex,
          },
          { "all_jobs.date_deadline": { $gte: new Date() } },
        ],
      },
    },
  ]).then((jobs) => {
    return res.status(200).json(jobs);
  });
});

router.post("/rate_job", (req, res) => {
  console.log(req.body.rating);
  Job.updateOne(
    { _id: ObjectId(req.body.job_id) },
    {
      $push: { rating: req.body.rating, app_rating: req.body.app_id },
    }
  ).then((t) => {
    res.status(200).json(t);
  });
});

router.post("/delete_job", (req, res) => {
  Job.findOne({ _id: ObjectId(req.body.job_id) }).then((t) => {
    for (var i = 0; i < t.applicants.length; i++) {
      Applicants.updateOne(
        { ref_id: t.applicants[i] },
        { $inc: { no_applications: -1 } }
      ).then((y) => {
        console.log(y);
      });
    }
    Application.remove({ job_id: req.body.job_id }).then((o) => [
      Job.remove({ _id: ObjectId(req.body.job_id) }).then((r) => {
        return res.status(200).json({ work: "worked" });
      }),
    ]);
  });
});

router.post("/edit_max_app", (req, res) => [
  Job.updateOne(
    { _id: ObjectId(req.body.job_id) },
    { max_application: req.body.max_app }
  ).then((t) => {
    res.status(200).json(t);
  }),
]);

router.post("/edit_max_pos", (req, res) => [
  Job.updateOne(
    { _id: ObjectId(req.body.job_id) },
    { max_position: req.body.max_pos }
  ).then((t) => {
    res.status(200).json(t);
  }),
]);

router.post("/edit_deadline", (req, res) => [
  Job.updateOne(
    { _id: ObjectId(req.body.job_id) },
    { date_deadline: req.body.date_deadline }
  ).then((t) => {
    res.status(200).json(t);
  }),
]);

module.exports = router;
