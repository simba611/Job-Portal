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

class RejobList extends Component {
  constructor() {
    super();
    this.state = {
      jobs: [],
    };
  }

  componentDidMount() {
    const me = {
      rec_id: this.props.auth.user.id,
    };
    axios
      .post("/api/recruiters/active_list", me)
      .then((res) => {
        this.setState({ jobs: res.data });
      })
      .catch((err) => {
        alert(err);
      });
  }

  deleteJob = (e) => {
    e.preventDefault();
    const u = {
      job_id: e.target.value,
    };
    axios.post("/api/api_jobs/delete_job", u).then((res) => {
      console.log(res);
    });
    document.getElementById(u.job_id).style.display = "none";
  };

  EditMaxApp = (e) => {
    e.preventDefault();
    const y = document.getElementById(
      e.target.getAttribute("data-value") + "hello"
    ).value;
    console.log(y);
    if (parseInt(y) > 0) {
      const u = {
        job_id: e.target.getAttribute("data-value"),
        max_app: parseInt(y),
      };
      axios.post("/api/api_jobs/edit_max_app", u).then((res) => {
        console.log(res);
        const me = {
          rec_id: this.props.auth.user.id,
        };
        axios
          .post("/api/recruiters/active_list", me)
          .then((res) => {
            this.setState({ jobs: res.data });
          })
          .catch((err) => {
            alert(err);
          });
      });
    } else {
      alert("Enter a positive integer");
    }
  };

  EditMaxPos = (e) => {
    e.preventDefault();
    const y = document.getElementById(
      e.target.getAttribute("data-value") + "hehe"
    ).value;
    console.log(y);
    if (parseInt(y) > 0) {
      const u = {
        job_id: e.target.getAttribute("data-value"),
        max_pos: parseInt(y),
      };
      axios.post("/api/api_jobs/edit_max_pos", u).then((res) => {
        console.log(res);
        const me = {
          rec_id: this.props.auth.user.id,
        };
        axios
          .post("/api/recruiters/active_list", me)
          .then((res) => {
            this.setState({ jobs: res.data });
          })
          .catch((err) => {
            alert(err);
          });
      });
    } else {
      alert("Enter a positive integer");
    }
  };

  EditDeadline = (e) => {
    e.preventDefault();
    const rr = e.target.getAttribute("data-value");
    var date = document.getElementById(
      e.target.getAttribute("data-value") + "date"
    ).value;
    const time = document.getElementById(
      e.target.getAttribute("data-value") + "time"
    ).value;
    //   console.log("date "+date)
    //   console.log("time "+time)
    if (date === "") {
      alert("Enter a date");
    } else {
      if (time !== "") {
        date = date + "T" + time;
      }
      const ob = {
        job_id: rr,
        date_deadline: date,
      };
      axios.post("/api/api_jobs/edit_deadline", ob).then((res) => {
        console.log(res);
        const me = {
          rec_id: this.props.auth.user.id,
        };
        axios
          .post("/api/recruiters/active_list", me)
          .then((res) => {
            this.setState({ jobs: res.data });
          })
          .catch((err) => {
            alert(err);
          });
      });
      //   console.log(date)
    }
  };

  render() {
    const jobs = this.state.jobs;
    return (
      <div className="container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Title</b>
              </TableCell>
              <TableCell>
                <b>Date of posting</b>
              </TableCell>
              <TableCell>
                <b>Number of applicants</b>
              </TableCell>
              <TableCell>
                <b>Max number of applicants</b>
              </TableCell>
              <TableCell>
                <b>Remaining number of positions</b>
              </TableCell>
              <TableCell>
                <b>Max number of positions</b>
              </TableCell>
              <TableCell>
                <b>Deadline for application</b>
              </TableCell>
              <TableCell>
                <b>Delete</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map(function (d, idx) {
              return (
                <TableRow id={d._id} key={idx}>
                  <TableCell>{d.title}</TableCell>
                  <TableCell>{d.date_posting}</TableCell>
                  <TableCell>{d.num_app}</TableCell>
                  <TableCell>
                    {d.max_application}
                    <form data-value={d._id} onSubmit={this.EditMaxApp}>
                      <input id={d._id + "hello"} type="number"></input>
                      <button
                        type="submit"
                        class="waves-effect waves-light btn-small"
                      >
                        Edit
                      </button>
                    </form>
                  </TableCell>
                  <TableCell>{d.max_position - d.accepted.length}</TableCell>
                  <TableCell>
                    {d.max_position}
                    <form data-value={d._id} onSubmit={this.EditMaxPos}>
                      <input id={d._id + "hehe"} type="number"></input>
                      <button
                        type="submit"
                        class="waves-effect waves-light btn-small"
                      >
                        Edit
                      </button>
                    </form>
                  </TableCell>
                  <TableCell>
                    {d.date_deadline}
                    <form data-value={d._id} onSubmit={this.EditDeadline}>
                      <input id={d._id + "date"} type="date"></input>
                      <input id={d._id + "time"} type="time"></input>
                      <button
                        type="submit"
                        class="waves-effect waves-light btn-small"
                      >
                        Edit
                      </button>
                    </form>
                  </TableCell>

                  <TableCell align="right">
                    <button
                      onClick={this.deleteJob}
                      value={d._id}
                      class="waves-effect waves-light btn-small"
                    >
                      &#10006;
                    </button>
                  </TableCell>
                  <TableCell>
                      <a href={"/applicants/"+d._id}>View Applicants</a>
                      </TableCell>
                </TableRow>
              );
            }, this)}
          </TableBody>
        </Table>
      </div>
    );
  }
}

RejobList.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(RejobList);
