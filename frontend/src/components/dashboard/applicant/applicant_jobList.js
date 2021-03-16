import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";
import { logoutUser } from "../../../actions/authActions";
// import jobs from "../../../../../backend/validation/jobs";

class jobList extends Component {
  constructor() {
    super();
    this.state = {
      jobs: [],
      salary_sort: 0,
      duration_sort: 0,
      rating_sort: 0,
      sort_by: "salary",
      seach: "",
      job_type: "",
      duration: "",
      min: 0,
      max: 1000000000,
      min_error: "",
      sop: "",
      who_apply: "",
      error: {},
    };
    // this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    axios
      .get("/api/api_jobs/send_all")
      .then((res) => {
        this.setState({ jobs: res.data });
      })
      .catch((err) => {
        alert(err);
      });
    // console.log(this.state.jobs)
    this.setState({ salary_sort: 1 });
    this.setState({ duration_sort: -1 });
    this.setState({ rating_sort: -1 });
  }

  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
    // console.log(e.target.value);
    if (e.target.value === "salary") {
      this.setState({ salary_sort: -1 * this.state.salary_sort });
      console.log(this.state.salary_sort);
    } else if (e.target.value === "duration") {
      this.setState({ duration_sort: -1 * this.state.duration_sort });
    } else if (e.target.value === "rating") {
      this.setState({ rating_sort: -1 * this.state.rating_sort });
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    const search_word = {
      search: this.state.search,
    };
    axios.post("/api/api_jobs/job_search", search_word).then((res) => {
      this.setState({ jobs: res.data });
    });
  };

  onSubmit2 = (e) => {
    e.preventDefault();
    const filter_word = {
      job_type: this.state.job_type,
      duration: parseInt(this.state.duration),
      min: parseInt(this.state.min),
      max: parseInt(this.state.max),
    };
    axios.post("/api/api_jobs/filter", filter_word).then((res) => {
      console.log(res.data);
      this.setState({ jobs: res.data });
    });
  };

  EnterSOP = (e) => {
    // document.getElementById(e.target.id).disabled = true;
    this.setState({ who_apply: e.target.value });
    document.getElementById("ssoopp").style.display = "inline";
  };

  ApplyJob = (e) => {
    e.preventDefault();
    document.getElementById("ssoopp").style.display = "none";
    if (this.state.sop.split(" ").length > 250) {
      alert("SOP must be less than 250 words");
    } else {
      const application = {
        app_id: this.props.auth.user.id,
        job_id: this.state.who_apply,
        sop: this.state.sop,
      };
      // console.log(e.target.value);
      console.log(application);
      axios
        .post("/api/applications/create_application", application)
        .then((res) => {
          axios
            .get("/api/api_jobs/send_all")
            .then((res) => {
              this.setState({ jobs: res.data });
            })
            .catch((err) => {
              alert(err);
            });
          document.getElementById(this.state.who_apply).disabled = true;
          document.getElementById(this.state.who_apply).innerText = "Applied";
          // this.HasApplied(e.target.value);
        })
        .catch((err) => {
          // this.setState({ errors: err.response.data });
          console.log("deadline" + err.response.data.deadline);
          console.log("application" + err.response.data.application_limit);
          if (typeof err.response.data.deadline != "undefined") {
            alert("Refresh page");
          } else if (
            typeof err.response.data.application_limit != "undefined"
          ) {
            alert("Cannot apply to more than 10 jobs");
          }
        });
    }
  };

  render() {
    const jobs = this.state.jobs;
    const which = this.state.sort_by;
    const salary_sort = this.state.salary_sort;
    const duration_sort = this.state.duration_sort;
    const rating_sort = this.state.rating_sort;
    const ap = (e) => {
      var tot = 0;
      for (var i = 0; i < e.length; i++) {
        tot = tot + e[i];
      }
      if (e.length == 1) {
        return 0;
      } else {
        return tot / (e.length - 1);
      }
    };
    // const min_max = this.state.min_error;
    return (
      <div className="container">
        <form noValidate onSubmit={this.onSubmit}>
          <input id="search" onChange={this.onChange} type="text"></input>
          <button class="waves-effect waves-light btn-small" type="submit">
            Search
          </button>
        </form>
        <br />
        <br />
        <form noValidate onSubmit={this.onSubmit2}>
          <p>Job Type:</p>
          <select
            class="browser-default"
            onChange={this.onChange}
            name="job_type"
            id="job_type"
          >
            <option selected="selected" value="">
              N/A
            </option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Work from Home">Work from home</option>
          </select>
          <br />
          <p>Salary:</p>
          <div class="input-field col s6">
            <input id="min" onChange={this.onChange} type="Number" />
            <label for="min">Minimum Salary</label>
          </div>
          <div class="input-field col s6">
            <input id="max" onChange={this.onChange} type="Number" />
            <label for="max">Maximum Salary</label>
          </div>
          {/* <span className="red-text">{min_max}</span> */}
          <p>Duration:</p>
          <select
            class="browser-default"
            onChange={this.onChange}
            name="duration"
            id="duration"
          >
            <option selected="selected" value="">
              N/A
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
          </select>
          <br />
          <button class="waves-effect waves-light btn-small" type="submit">
            Filter
          </button>
        </form>
        <Table>
          <TableHead align="center">
            <TableRow hover>
              <TableCell>
                <b>Title</b>
                <b> </b>
              </TableCell>
              <TableCell>
                {" "}
                <b>Recruiter Name</b>
                <b> </b>
              </TableCell>
              <TableCell>
                {" "}
                <b>Salary</b>
                <b> </b>
                <button
                  class="waves-effect waves-light btn-small"
                  type="button"
                  onClick={this.onChange}
                  id="sort_by"
                  value="salary"
                >
                  <img
                    src="https://cdn3.iconfinder.com/data/icons/pyconic-icons-2-1/512/arrow-double-up-down-512.png"
                    width="10"
                    height="10"
                  />
                </button>
              </TableCell>
              <TableCell>
                {" "}
                <b>Duration</b>
                <b> </b>
                <button
                  class="waves-effect waves-light btn-small"
                  type="button"
                  onClick={this.onChange}
                  id="sort_by"
                  value="duration"
                >
                  <img
                    src="https://cdn3.iconfinder.com/data/icons/pyconic-icons-2-1/512/arrow-double-up-down-512.png"
                    width="10"
                    height="10"
                  />
                </button>
              </TableCell>
              <TableCell>
                {" "}
                <b>Deadline</b>
                <b></b>
              </TableCell>
              <TableCell>
                {" "}
                <b>Rating</b>
                <b></b>
                <button
                  class="waves-effect waves-light btn-small"
                  type="button"
                  onClick={this.onChange}
                  id="sort_by"
                  value="rating"
                >
                  <img
                    src="https://cdn3.iconfinder.com/data/icons/pyconic-icons-2-1/512/arrow-double-up-down-512.png"
                    width="10"
                    height="10"
                  />
                </button>
              </TableCell>
              <TableCell>
                {" "}
                <b>Job Type</b>
                <b> </b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs
              .sort(function (a, b) {
                if (which == "salary") {
                  return salary_sort * (a.all_jobs.salary - b.all_jobs.salary);
                } else if (which == "duration") {
                  return (
                    duration_sort * (a.all_jobs.duration - b.all_jobs.duration)
                  );
                } else if (which == "rating") {
                  return (
                    rating_sort *
                    (ap(a.all_jobs.rating) - ap(b.all_jobs.rating))
                  );
                }
              })
              .map(function (d, idx) {
                return (
                  // <Fragment>
                  <TableRow key={idx}>
                    <TableCell>{d.all_jobs.title}</TableCell>
                    <TableCell>{d.name}</TableCell>
                    <TableCell>{d.all_jobs.salary}</TableCell>
                    <TableCell>{d.all_jobs.duration}</TableCell>
                    <TableCell>{d.all_jobs.date_deadline}</TableCell>
                    <TableCell>{ap(d.all_jobs.rating)}</TableCell>
                    <TableCell>{d.all_jobs.job_type}</TableCell>
                    <TableCell align="right">
                      {!(
                        d.all_jobs.max_application == d.all_jobs.num_app ||
                        d.all_jobs.max_position == d.all_jobs.accepted.length
                      ) &&
                        d.all_jobs.applicants.find(
                          (id1) => id1 == this.props.auth.user.id
                        ) && (
                          <button
                            id={d.all_jobs._id}
                            class="waves-effect waves-light btn-small"
                            value={d.all_jobs._id}
                            onClick={this.ApplyJob}
                            disabled
                          >
                            Applied
                            {/* {d.all_jobs.applicants.find(
                            (id1) => id1 == this.props.auth.user.id
                          ) && <b>Applied</b>}
                          {!d.all_jobs.applicants.find(
                            (id1) => id1 == this.props.auth.user.id
                          ) && <b>Apply</b>} */}
                          </button>
                        )}
                      {!(
                        d.all_jobs.max_application == d.all_jobs.num_app ||
                        d.all_jobs.max_position == d.all_jobs.accepted.length
                      ) &&
                        !d.all_jobs.applicants.find(
                          (id1) => id1 == this.props.auth.user.id
                        ) && (
                          <button
                            id={d.all_jobs._id}
                            class="waves-effect waves-light btn-small"
                            value={d.all_jobs._id}
                            onClick={this.EnterSOP}
                            // disabled
                          >
                            Apply
                            {/* {d.all_jobs.applicants.find(
                            (id1) => id1 == this.props.auth.user.id
                          ) && <b>Applied</b>}
                          {!d.all_jobs.applicants.find(
                            (id1) => id1 == this.props.auth.user.id
                          ) && <b>Apply</b>} */}
                          </button>
                        )}
                      {(d.all_jobs.max_application == d.all_jobs.num_app ||
                        d.all_jobs.max_position ==
                          d.all_jobs.accepted.length) && (
                        <button
                          class="waves-effect waves-light btn-small"
                          disabled
                        >
                          Full
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                  // </Fragment>
                );
              }, this)}
            {/* <TableCell>Hello2</TableCell> */}
          </TableBody>
        </Table>
        <div id="ssoopp" style={{ display: "none" }}>
          <form className="input-field col s12" onSubmit={this.ApplyJob}>
            SOP:
            <input id="sop" onChange={this.onChange} type="text"></input>
            {/* <label htmlFor="sop">SOP</label> */}
            <button class="waves-effect waves-light btn-small" type="submit">
              Submit
            </button>
          </form>
        </div>
        <br />
        <br />
        <hr height="1" />
        <br />
        <button
          class="waves-effect waves-light btn-small"
          onClick={this.onLogoutClick}
          // className="btn btn-large waves-effect waves-light hoverable blue accent-3"
        >
          Logout
        </button>
        <br />
        <br />
        <hr height="1" />
        <br />
        <br />
      </div>
    );
  }
}

jobList.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logoutUser })(jobList);
