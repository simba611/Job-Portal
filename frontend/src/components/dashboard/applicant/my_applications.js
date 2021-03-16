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

class MyApplication extends Component {
  constructor() {
    super();
    this.state = {
      myapp: [],
    };
    // this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const us = {
      app_id: this.props.auth.user.id,
    };
    axios.post("/api/applicants/my_applications", us).then((app) => {
      console.log(app.data);
      this.setState({ myapp: app.data });
    });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const rem = e.target.getAttribute("data-value1");
    const f = document.getElementById(e.target.getAttribute("data-value1"))
      .value;
    const rr = {
      rating: parseInt(f),
      job_id: e.target.getAttribute("data-value"),
      app_id: this.props.auth.user.id,
    };
    axios.post("/api/api_jobs/rate_job", rr).then((re) => {
      console.log(re);
      const us = {
        app_id: this.props.auth.user.id,
      };
      axios.post("/api/applicants/my_applications", us).then((app) => {
        console.log(app.data);
        this.setState({ myapp: app.data });
      });
      document.getElementById(rem).disabled = true;
    });
  };

  render() {
    const myapp = this.state.myapp;
    return (
      <div className="container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Title</b>
              </TableCell>
              <TableCell>
                <b>Salary</b>
              </TableCell>
              <TableCell>
                <b>Recruiter Name</b>
              </TableCell>
              <TableCell>
                <b>Status</b>
              </TableCell>
              <TableCell>
                <b>Date of joining</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myapp.map(function (d, idx) {
              return (
                <TableRow key={idx}>
                  <TableCell>{d.title}</TableCell>
                  <TableCell>{d.salary}</TableCell>
                  <TableCell>{d.final.name}</TableCell>
                  <TableCell>{d.job_app.status}</TableCell>
                  <TableCell>{d.job_app.date_of_joining}</TableCell>
                  {d.job_app.status == "Accepted" &&
                    !d.app_rating.find(
                      (id1) => id1 == this.props.auth.user.id
                    ) && (
                      <TableCell>
                        <div>
                          <form
                            data-value1={d._id}
                            data-value={d.job_app.job_id}
                            onSubmit={this.onSubmit}
                          >
                            <select id={d._id} class="browser-default">
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                            <button
                              type="submit"
                              class="waves-effect waves-light btn-small"
                              id={d._id}
                            >
                              Rate
                            </button>
                          </form>
                        </div>
                      </TableCell>
                    )}
                  {d.job_app.status == "Accepted" &&
                    d.app_rating.find(
                      (id1) => id1 == this.props.auth.user.id
                    ) && <TableCell>Rated</TableCell>}
                </TableRow>
              );
            }, this)}
          </TableBody>
        </Table>
      </div>
    );
  }
}

MyApplication.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(MyApplication);
