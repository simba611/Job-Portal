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

class AppProfile extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      skills: [],
      education: [],
      name_text: false,
      email_text: false,
      skill_text: false,
      change_name: "",
      change_email: "",
      add_skill: "C++",
      edu_name: "",
      edu_start: "",
      edu_end: "",
      errors: {
        name: "",
        email: "",
        skill: "",
        education: "",
      },
    };
    // this.RemoveSkill = this.RemoveSkill.bind(this);
  }

  componentDidMount() {
    console.log(this.props.auth);
    axios
      .post("/api/applicants/get_profile", { id: this.props.auth.user.id })
      .then((user) => {
        this.setState({
          skills: user.data.skills,
          education: user.data.education,
        });
      });
    axios
      .post("/api/applicants/get_email", { id: this.props.auth.user.id })
      .then((user) => {
        this.setState({ email: user.data.email, name: user.data.name });
      });
  }

  DisplayNameInput = (e) => {
    if (this.state.name_text === false) {
      this.setState({ name_text: true });
    } else {
      this.setState({ name_text: false });
    }
  };

  DisplayEmailInput = (e) => {
    if (this.state.email_text === false) {
      this.setState({ email_text: true });
    } else {
      this.setState({ email_text: false });
    }
  };

  DisplaySkillInput = (e) => {
    if (this.state.skill_text === false) {
      this.setState({ skill_text: true });
    } else {
      this.setState({ skill_text: false });
    }
  };

  ChangeName = (e) => {
    e.preventDefault();
    const change = {
      id: this.props.auth.user.id,
      name: this.state.change_name,
    };
    axios
      .post("/api/applicants/change_name", change)
      .then((res) => {
        axios
          .post("/api/applicants/get_email", { id: this.props.auth.user.id })
          .then((user) => {
            this.setState({
              email: user.data.email,
              name: user.data.name,
              name_text: false,
            });
          });
      })
      .catch((err) => {
        this.setState({ name_text: false });
        console.log(err);
      });
  };

  ChangeEmail = (e) => {
    e.preventDefault();
    const change = {
      id: this.props.auth.user.id,
      email: this.state.change_email,
    };
    axios
      .post("/api/applicants/change_email", change)
      .then((err) => {
        axios
          .post("/api/applicants/get_email", { id: this.props.auth.user.id })
          .then((user) => {
            this.setState({
              email: user.data.email,
              name: user.data.name,
              email_text: false,
            });
          });
      })
      .catch((err) => {
        this.setState({ email_text: false });
        console.log(err.response.data);
        alert("Invalid email or already taken");
      });
  };

  Redirect_skill = (e) => {
    e.preventDefault();
    if (this.state.add_skill !== "other") {
      this.AddSkill(e);
    } else {
      this.DisplaySkillInput(e);
    }
  };

  AddSkill = (e) => {
    e.preventDefault();
    const skill_info = {
      id: this.props.auth.user.id,
      skill: this.state.add_skill,
    };
    axios
      .post("/api/applicants/add_skill", skill_info)
      .then((res) => {
        axios
          .post("/api/applicants/get_profile", { id: this.props.auth.user.id })
          .then((user) => {
            this.setState({
              skills: user.data.skills,
              education: user.data.education,
              skill_text: false,
            });
          });
      })
      .catch((err) => {
        alert("Skill already exists");
      });
  };

  RemoveSkill = (e) => {
    e.preventDefault();
    const remove = {
      id: this.props.auth.user.id,
      skill: e.target.value,
    };
    axios.post("/api/applicants/remove_skill", remove).then((res) => {
      axios
        .post("/api/applicants/get_profile", { id: this.props.auth.user.id })
        .then((user) => {
          this.setState({
            skills: user.data.skills,
            education: user.data.education,
            skill_text: false,
          });
        });
    });
  };

  RemoveEdu = (e) => {
    e.preventDefault();
    const remove = {
      id: this.props.auth.user.id,
      edu_id: e.target.value,
    };
    axios.post("/api/applicants/remove_education", remove).then((res) => {
      axios
        .post("/api/applicants/get_profile", { id: this.props.auth.user.id })
        .then((user) => {
          this.setState({
            skills: user.data.skills,
            education: user.data.education,
          });
        });
    });
  };

  AddEdu = (e) => {
    e.preventDefault();
    const edu_add = {
      id: this.props.auth.user.id,
      edu_name: this.state.edu_name,
      start_date: this.state.edu_start,
      end_date: this.state.edu_end,
    };
    axios
      .post("/api/applicants/add_education", edu_add)
      .then((res) => {
        axios
          .post("/api/applicants/get_profile", { id: this.props.auth.user.id })
          .then((user) => {
            this.setState({
              skills: user.data.skills,
              education: user.data.education,
            });
          });
      })
      .catch((err) => {
        alert("Add both name and start date");
      });
  };

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const listSkills = this.state.skills;
    const listEdu = this.state.education;
    let { name_text, email_text, skill_text, errors } = this.state;
    return (
      <div className="container">
        <div>
          <b>Name: </b>
          {this.state.name}
          <b> </b>
          {/* <span>{errors.name}</span> */}
          <form onSubmit={this.ChangeName}>
            {name_text && (
              <input
                id="change_name"
                onChange={this.onChange}
                type="text"
              ></input>
            )}
            {name_text && (
              <button class="waves-effect waves-light btn-small" type="submit">
                Apply
              </button>
            )}
          </form>
          {!name_text && (
            <button
              class="waves-effect waves-light btn-small"
              onClick={this.DisplayNameInput}
            >
              Change
            </button>
          )}
        </div>
        <div>
          <b>Email: </b>
          {this.state.email}
          <b> </b>
          <form onSubmit={this.ChangeEmail}>
            {email_text && (
              <input
                id="change_email"
                onChange={this.onChange}
                type="text"
              ></input>
            )}
            {/* <span>{errors.error}</span> */}
            {email_text && (
              <button class="waves-effect waves-light btn-small" type="submit">
                Apply
              </button>
            )}
          </form>
          {!email_text && (
            <button
              class="waves-effect waves-light btn-small"
              onClick={this.DisplayEmailInput}
            >
              Change
            </button>
          )}
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Skills</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listSkills.map(function (d, idx) {
              return (
                <TableRow key={idx}>
                  <TableCell>{d}</TableCell>
                  <TableCell align="right">
                    <button
                      onClick={this.RemoveSkill}
                      class="waves-effect waves-light btn-small"
                      value={d}
                    >
                      &#10006;
                    </button>
                  </TableCell>
                </TableRow>
              );
            }, this)}
          </TableBody>
        </Table>
        <hr />
        <form onSubmit={this.Redirect_skill}>
          <select
            class="browser-default"
            name="add_skill"
            id="add_skill"
            onChange={this.onChange}
          >
            <option disabled={skill_text} value="C++">
              C++
            </option>
            <option disabled={skill_text} value="C">
              C
            </option>
            <option disabled={skill_text} value="python">
              python
            </option>
            <option disabled={skill_text} value="Web Development">
              Web Development
            </option>
            <option disabled={skill_text} value="other">
              Enter your own
            </option>
          </select>
          <br />
          {!skill_text && (
            <button class="waves-effect waves-light btn-small" type="submit">
              Add skill
            </button>
          )}
        </form>
        <form onSubmit={this.Redirect_skill}>
          {skill_text && (
            <input id="add_skill" onChange={this.onChange} type="text"></input>
          )}
          {skill_text && (
            <button class="waves-effect waves-light btn-small" type="submit">
              Add skill
            </button>
          )}
        </form>
        <hr />
        <br />
        <br />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Education</b>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Start Date</b>
              </TableCell>
              <TableCell>
                <b>End Date</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listEdu.map(function (d, idx) {
              return (
                <TableRow>
                  <TableCell>{d.edu_name}</TableCell>
                  <TableCell>{d.start_date}</TableCell>
                  <TableCell>{d.end_date}</TableCell>
                  <TableCell align="right">
                    <button
                      onClick={this.RemoveEdu}
                      class="waves-effect waves-light btn-small"
                      value={d._id}
                    >
                      &#10006;
                    </button>
                  </TableCell>
                </TableRow>
              );
            }, this)}
          </TableBody>
        </Table>
        <hr />
        Add Education:
        <br />
        <br />
        <form onSubmit={this.AddEdu}>
          Name:
          <div className="input-field col s12">
            <input onChange={this.onChange} type="text" id="edu_name"></input>
            <label>Name</label>
          </div>
          Start Date:
          <div className="input-field col s12">
            <input onChange={this.onChange} type="date" id="edu_start"></input>
          </div>
          End Date:
          <div className="input-field col s12">
            <input onChange={this.onChange} type="date" id="edu_end"></input>
          </div>
          <button class="waves-effect waves-light btn-small" type="submit">
            Add Education
          </button>
        </form>
        <br />
        <br />
        <br />
        <br />
        <hr />
        <button
          style={{
            width: "150px",
            borderRadius: "3px",
            letterSpacing: "1.5px",
            marginTop: "1rem",
          }}
          onClick={this.onLogoutClick}
          className="btn btn-large waves-effect waves-light hoverable blue accent-3"
        >
          Logout
        </button>
        <br />
        <br />
        <hr />
      </div>
    );
  }
}
AppProfile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logoutUser })(AppProfile);
