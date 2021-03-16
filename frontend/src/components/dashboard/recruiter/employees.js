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

class EmployeeList extends Component {
  constructor() {
    super();
    this.state = {
      employees: [],
      sort_by: "name",
      name_sort: 0,
      title_Sort: 0,
      date_sort: 0,
      rating_sort: 0,
    };
  }

  componentDidMount() {
    const me = {
      rec_id: this.props.auth.user.id,
    };
    axios
      .post("/api/recruiters/employees", me)
      .then((res) => {
        this.setState({ employees: res.data });
      })
      .catch((err) => {
        alert(err);
      });
    this.setState({ name_sort: 1, title_sort: -1, date_sort: -1 });
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
    // console.log(e.target.value);
    if (e.target.value === "name") {
      this.setState({ name_sort: -1 * this.state.name_sort });
      //   console.log(this.state.salary_sort);
    } else if (e.target.value === "title") {
      this.setState({ title_sort: -1 * this.state.title_sort });
    } else if (e.target.value === "date") {
      this.setState({ date_sort: -1 * this.state.date_sort });
    } else if (e.target.value === "rating") {
      this.setState({ rating_sort: -1 * this.state.rating_sort });
    }
  };

  RateApp = (e) => {
    e.preventDefault();
    const ob = {
      app_id: e.target.getAttribute("data-value2"),
      rec_id: this.props.auth.user.id,
      rating: document.getElementById(e.target.getAttribute("data-value1"))
        .value,
    };
    console.log(ob);
    axios.post("/api/applicants/rate_app", ob).then((res) => {
      const me = {
        rec_id: this.props.auth.user.id,
      };
      axios
        .post("/api/recruiters/employees", me)
        .then((res) => {
          this.setState({ employees: res.data });
        })
        .catch((err) => {
          alert(err);
        });
    });
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  render() {
    const employees = this.state.employees;
    const which = this.state.sort_by;
    const name_sort = this.state.name_sort;
    const title_sort = this.state.title_sort;
    const rating_sort = this.state.rating_sort;
    const date_sort = this.state.date_sort;
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
                <b>Date of Joining</b>
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
                <b>Job Type</b>
              </TableCell>
              <TableCell>
                <b>Job Title</b>
                <button
                  class="waves-effect waves-light btn-small"
                  type="button"
                  onClick={this.onChange}
                  id="sort_by"
                  value="title"
                >
                  <img
                    src="https://cdn3.iconfinder.com/data/icons/pyconic-icons-2-1/512/arrow-double-up-down-512.png"
                    width="10"
                    height="10"
                  />
                </button>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {employees
              .sort(function (a, b) {
                if (which == "name") {
                  return (
                    name_sort * a.also_name.name.localeCompare(b.also_name.name)
                  );
                } else if (which == "title") {
                  return (
                    title_sort * a.job_app.title.localeCompare(b.job_app.title)
                  );
                } else if (which == "rating") {
                  return (
                    rating_sort *
                    (ap(a.applicant.rating) - ap(b.applicant.rating))
                  );
                } else if (which == "date") {
                  var d1 = new Date(a.date_of_joining);
                  var d2 = new Date(b.date_of_joining);
                  return date_sort * (d1.getTime() < d2.getTime ? 1 : -11);
                }
              })
              .map(function (d, idx) {
                return (
                  <TableRow key={idx}>
                    <TableCell>{d.also_name.name}</TableCell>
                    <TableCell>{d.date_of_joining}</TableCell>
                    <TableCell>{d.job_app.job_type}</TableCell>
                    <TableCell>{d.job_app.title}</TableCell>
                    <TableCell>{ap(d.applicant.rating)}</TableCell>
                    {!d.applicant.who_rated.find(
                      (id1) => id1 == this.props.auth.user.id
                    ) && (
                      <TableCell>
                        <div>
                          <form
                            data-value1={d._id}
                            data-value2={d.app_id}
                            onSubmit={this.RateApp}
                          >
                            <select class="browser-default" id={d._id}>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                            <button
                              class="waves-effect waves-light btn-small"
                              type="submit"
                            >
                              Rate
                            </button>
                          </form>
                        </div>
                      </TableCell>
                    )}
                    {d.applicant.who_rated.find(
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

EmployeeList.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(EmployeeList);
