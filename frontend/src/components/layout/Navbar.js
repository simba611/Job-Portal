import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
class Navbar extends Component {
  render() {
    return (
      <div>
        <nav>
          <div class="nav-wrapper">
            <ul id="nav-mobile" class="left hide-on-med-and-down">
              <li>
                {this.props.auth.user.kind == "Applicant" && (
                  <Link
                    to="/app_profile"
                    style={{
                      fontFamily: "monospace",
                    }}
                    className="col s5  black-text"
                  >
                    Profile
                  </Link>
                )}
                {this.props.auth.user.kind == "Recruiter" && (
                  <Link
                    to="/re_profile"
                    style={{
                      fontFamily: "monospace",
                    }}
                    className="col s5  black-text"
                  >
                    Profile
                  </Link>
                )}
              </li>
              <li>
                {this.props.auth.user.kind == "Applicant" && (
                  <Link
                    to="/applicantDashboard"
                    style={{
                      fontFamily: "monospace",
                    }}
                    className="col s5  black-text"
                  >
                    Job List
                  </Link>
                )}
                {this.props.auth.user.kind == "Recruiter" && (
                  <Link
                    to="/new_job"
                    style={{
                      fontFamily: "monospace",
                    }}
                    className="col s5  black-text"
                  >
                    New Job
                  </Link>
                )}
              </li>
              <li>
                {this.props.auth.user.kind == "Applicant" && (
                  <Link
                    to="/my_application"
                    style={{
                      fontFamily: "monospace",
                    }}
                    className="col s5  black-text"
                  >
                    My Applications
                  </Link>
                )}
                {this.props.auth.user.kind == "Recruiter" && (
                  <Link
                    to="/job_list"
                    style={{
                      fontFamily: "monospace",
                    }}
                    className="col s5  black-text"
                  >
                    Job List
                  </Link>
                )}
              </li>
              <li>
              {this.props.auth.user.kind == "Recruiter" && (
                  <Link
                    to="/employees"
                    style={{
                      fontFamily: "monospace",
                    }}
                    className="col s5  black-text"
                  >
                    Employees
                  </Link>
                )}
              </li>
            </ul>
            {/* <ul>
              <Link
                to="/"
                style={{
                  fontFamily: "monospace",
                }}
                className="col s5 black-text"
              >
                <i className="material-icons">code</i>
                MERN
              </Link>
            </ul>
            <ul>
              {this.props.auth.user.kind == "Applicant" && (
                <Link
                  to="/app_profile"
                  style={{
                    fontFamily: "monospace",
                  }}
                  className="col s5  black-text"
                >
                  <i className="material-icons">code</i>
                  Profile
                </Link>
              )}
              {this.props.auth.user.kind == "Recruiter" && (
                <Link
                  to="/re_profile"
                  style={{
                    fontFamily: "monospace",
                  }}
                  className="col s5  black-text"
                >
                  <i className="material-icons">code</i>
                  Profile
                </Link>
              )}
            </ul>
            <ul>
              <Link
                to="/applicantDashboard"
                style={{
                  fontFamily: "monospace",
                }}
                className="col s5 brand-logo right black-text"
              >
                <i className="material-icons">code</i>
                Dashboard
              </Link>
            </ul> */}
          </div>
        </nav>
      </div>
    );
  }
}
Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(Navbar);
