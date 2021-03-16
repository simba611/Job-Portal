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
import emailjs from 'emailjs-com';

class AllApp extends Component {
  constructor() {
    super();
    this.state = {
      every: [],
      sort_by: "",
      name_sort: 0,
      date_sort: 0,
      rating_sort: 0,
    };
  }
  componentDidMount() {
    // console.log(this.props.match.params.job_id);
    const c = {
      job_id: this.props.match.params.job_id,
    };
    axios.post("/api/applicants/part_app", c).then((i) => {
      this.setState({ every: i.data });
    });
    this.setState({ name_sort: 1, date_sort: -1, rating_sort: -1 });
  }

  ShortList = (e) => {
    e.preventDefault();
    const c1 = {
      app_id: e.target.value,
    };
    axios
      .post("/api/applicants/shortlist", c1)
      .then((y) => {
        const c = {
          job_id: this.props.match.params.job_id,
        };
        axios.post("/api/applicants/part_app", c).then((i) => {
          this.setState({ every: i.data });
        });
        console.log(y);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  Reject = (e) => {
    e.preventDefault();
    const v = {
      app_id: e.target.getAttribute("data-value"),
      applicant_id: e.target.getAttribute("data-value1"),
      job_id: e.target.getAttribute("data-value2"),
    };
    axios.post("/api/applicants/reject", v).then((y) => {
      const c = {
        job_id: this.props.match.params.job_id,
      };
      axios.post("/api/applicants/part_app", c).then((i) => {
        this.setState({ every: i.data });
      });
      //   this.setState({ name_sort: 1, date_sort: -1, rating_sort: -1 });
    });
  };

  Accept = (e) => {
    e.preventDefault();
    emailjs
      .send("service_hgi7wfs", "template_sayebd3", {
        recruiter: this.props.auth.user.name,
      }, "user_UAXS2betX575ETfALYzxC")
      .then((res) => {
        console.log(res);
      });
    const v = {
      app_id: e.target.getAttribute("data-value"),
    };
    axios.post("/api/applicants/accept", v).then((y) => {
      const c = {
        job_id: this.props.match.params.job_id,
      };
      axios.post("/api/applicants/part_app", c).then((i) => {
        this.setState({ every: i.data });
      });
    });
  };

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
    // console.log(e.target.value);
    if (e.target.value === "name") {
      this.setState({ name_sort: -1 * this.state.name_sort });
      console.log(this.state.name_sort);
    } else if (e.target.value === "date") {
      this.setState({ date_sort: -1 * this.state.date_sort });
    } else if (e.target.value === "rating") {
      this.setState({ rating_sort: -1 * this.state.rating });
    }
  };

  render() {
    const every = this.state.every;
    const which = this.state.sort_by;
    const name_sort = this.state.name_sort;
    const date_sort = this.state.date_sort;
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
    const comma = (a) => {
      return a.join(" ,");
    };
    return (
      <div className="container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Name</b>
                <button
                  class="waves-effect waves-light btn-small"
                  type="button"
                  onClick={this.onChange}
                  id="sort_by"
                  value="name"
                >
                  <img
                    src="https://cdn3.iconfinder.com/data/icons/pyconic-icons-2-1/512/arrow-double-up-down-512.png"
                    width="10"
                    height="10"
                  />
                </button>
              </TableCell>
              <TableCell>
                <b>Skills</b>
              </TableCell>
              <TableCell>
                <b>Date of Application</b>
                <button
                  class="waves-effect waves-light btn-small"
                  type="button"
                  onClick={this.onChange}
                  id="sort_by"
                  value="date"
                >
                  <img
                    src="https://cdn3.iconfinder.com/data/icons/pyconic-icons-2-1/512/arrow-double-up-down-512.png"
                    width="10"
                    height="10"
                  />
                </button>
              </TableCell>
              <TableCell>
                <b>Education</b>
              </TableCell>
              <TableCell>
                <b>SOP</b>
              </TableCell>
              <TableCell>
                <b>Rating</b>
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
                <b>Stage of Application</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {every
              .sort(function (a, b) {
                if (which === "name") {
                  //   console.log("name");
                  return name_sort * a.also.name.localeCompare(b.also.name);
                }
                if (which === "date") {
                  var d1 = new Date(a.date_of_apply);
                  var d2 = new Date(b.date_of_apply);
                  // console.log( (d1.getTime() < d2.getTime() ? 1 : -1));
                  return date_sort * (d1.getTime() < d2.getTime() ? 1 : -1);
                }
                if (which === "rating") {
                  return (
                    rating_sort * (ap(a.all_app.rating) - ap(b.all_app.rating))
                  );
                }
              }, this)
              .map(function (d, idx) {
                return (
                  <TableRow key={idx}>
                    <TableCell>{d.also.name}</TableCell>
                    <TableCell>{comma(d.all_app.skills)}</TableCell>
                    <TableCell>{d.date_of_apply}</TableCell>
                    <TableCell>
                      {d.all_app.education.map((d) => {
                        return (
                          <p>
                            <b>Name:</b>
                            {d.edu_name}
                            <br />
                            <b>Start Date:</b>
                            {d.start_date} <br />
                            <b>End Date:</b>
                            {d.end_date}
                          </p>
                        );
                      })}
                    </TableCell>
                    <TableCell>{d.sop}</TableCell>
                    <TableCell>{d.all_app.rating}</TableCell>
                    <TableCell>{d.status}</TableCell>
                    {!d.all_app.employed && d.status == "Applied" && (
                      <TableCell>
                        <button
                          value={d._id}
                          class="waves-effect waves-light btn-small"
                          onClick={this.ShortList}
                        >
                          Shortlist
                        </button>
                      </TableCell>
                    )}
                    {!d.all_app.employed && d.status == "Shortlisted" && (
                      <TableCell>
                        <form
                          data-value={d._id}
                          data-value1={d.app_id}
                          data-value2={d.job_id}
                          onSubmit={this.Accept}
                        >
                          <button
                            value={d._id}
                            class="waves-effect waves-light btn-small"
                            type="submit"
                          >
                            Accept
                          </button>
                        </form>
                      </TableCell>
                    )}
                    {!d.all_app.employed && (
                      <TableCell>
                        <form
                          data-value={d._id}
                          data-value1={d.app_id}
                          data-value2={d.job_id}
                          onSubmit={this.Reject}
                        >
                          <button
                            type="submit"
                            class="waves-effect waves-light btn-small"
                          >
                            Reject
                          </button>
                        </form>
                      </TableCell>
                    )}
                    {/* {d.all_app.employed && d.status != "Accepted" && (
                      <TableCell>Rejected</TableCell>
                    )} */}
                  </TableRow>
                );
              }, this)}
          </TableBody>
        </Table>
      </div>
    );
  }
}

AllApp.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(AllApp);
