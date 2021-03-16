import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../../actions/authActions";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";

class NewJob extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      title: "",
      max_application: "",
      max_position: "",
      date_deadline: "",
      dead_time: "",
      skill_set: "",
      job_type: "",
      duration: "",
      salary: "",
    };
  }

  onChange = (e) => {
    // console.log(e.target.value);
    this.setState({ [e.target.id]: e.target.value });
    // console.log("gg" + this.state.date_deadline);
    // if (this.state.dead_time !== "") {
    //   const comb = e.target.value + "T" + this.state.dead_time + ":00Z";
    //   this.setState({ date_deadline: comb });
    // }
  };

  //   addTime = (e) => {
  //     // console.log("hello" + this.state.date_deadline);
  //     if (this.state.date_deadline !== "") {
  //       const comb = this.state.date_deadline + "T" + e.target.value + ":00Z";
  //       this.setState({ date_deadline: comb, dead_time: e.target.value });
  //     } else {
  //       this.setState({ dead_time: e.target.value });
  //     }
  //   };

  onSubmit = (e) => {
    e.preventDefault();
    const new_job = {
      title: this.state.title,
      max_application: this.state.max_application,
      id: this.props.auth.user.id,
      max_position: this.state.max_position,
      date_deadline: this.state.date_deadline,
      skill_set: this.state.skill_set,
      job_type: this.state.job_type,
      duration: this.state.duration,
      salary: this.state.salary,
    };
    if (new_job.duration == "") {
      new_job.duration = 0;
    }
    if (this.state.dead_time !== "") {
      new_job.date_deadline =
        this.state.date_deadline + "T" + this.state.dead_time + ":00";
    }
    console.log(new_job);
    axios
      .post("/api/api_jobs/add_job", new_job)
      .then((res) => {
        alert("Created");
      })
      .catch((err) => this.setState({ errors: err.response.data }));
    // this.setState({
    //   title: "",
    //   max_application: "",
    //   max_position: "",
    //   date_deadline: "",
    //   dead_time: "",
    //   skill_set: "",
    //   job_type: "",
    //   duration: "",
    //   salary: "",
    // });
    // document.getElementById("rrr").click();
  };

  render() {
    const { errors } = this.state;
    return (
      <div className="container">
        <b>Create new job:</b>
        <form onSubmit={this.onSubmit}>
          <div className="input-field col s12">
            {/* Title: */}
            <input type="text" id="title" onChange={this.onChange}></input>
            <label htmlFor="title">Title</label>
            <span className="red-text">{errors.title}</span>
          </div>
          <div className="input-field col s12">
            {/* Title: */}
            <input
              type="number"
              id="max_application"
              onChange={this.onChange}
            ></input>
            <label htmlFor="max_application">Max Applications</label>
            <span className="red-text">{errors.max_application}</span>
          </div>
          <div className="input-field col s12">
            {/* Title: */}
            <input
              type="number"
              id="max_position"
              onChange={this.onChange}
            ></input>
            <label htmlFor="max_position">Max Positions</label>
            <span className="red-text">{errors.max_position}</span>
          </div>
          <div>
            {/* Title: */}
            <label>
              <b>Deadline</b>
            </label>
            <br />
            {/* <hr/> */}
            <label>Date</label>
            <input
              type="date"
              id="date_deadline"
              onChange={this.onChange}
            ></input>
            <label>Time</label>
            <input type="time" id="dead_time" onChange={this.onChange}></input>
            <span className="red-text">{errors.date_deadline}</span>
            <hr />
          </div>
          <div className="input-field col s12">
            {/* Title: */}
            <input type="text" id="skill_set" onChange={this.onChange}></input>
            <label htmlFor="skill_set">Skill Set</label>
            <span className="red-text">{errors.skill_set}</span>
          </div>
          <div>
            <label>Job Type</label>
            <select
              class="browser-default"
              onChange={this.onChange}
              id="job_type"
            >
              <option selected="selected" value="">
                N/A
              </option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Work from Home">Work from Home</option>
            </select>
            <span className="red-text">{errors.job_type}</span>
          </div>
          <div>
            <label>Duration</label>
            <select
              class="browser-default"
              onChange={this.onChange}
              id="duration"
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
            {/* <span className="red-text">{errors.duration}</span> */}
          </div>
          <div className="input-field col s12">
            {/* Title: */}
            <input type="number" id="salary" onChange={this.onChange}></input>
            <label htmlFor="salary">Salary</label>
            <span className="red-text">{errors.salary}</span>
          </div>
          <button class="waves-effect waves-light btn-small" type="submit">
            Submit
          </button>
          {/* <input type="reset" /> */}
          <button id="rrr" type="reset" style={{ display: "none" }}></button>
        </form>
      </div>
    );
  }
}
NewJob.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logoutUser })(NewJob);
