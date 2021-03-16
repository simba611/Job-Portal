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

class ReProfile extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      contact: "",
      bio: "",
      name_text: false,
      email_text: false,
      contact_text: false,
      bio_text: false,
      change_name: "",
      change_email: "",
      change_contact: "",
      change_bio: "",
    };
  }

  componentDidMount() {
    console.log(this.props.auth);
    axios
      .post("/api/recruiters/get_profile", { id: this.props.auth.user.id })
      .then((user) => {
        this.setState({
          contact: user.data.contact,
          bio: user.data.bio,
        });
      });
    axios
      .post("/api/recruiters/get_email", { id: this.props.auth.user.id })
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

  DisplayContactInput = (e) => {
    if (this.state.contact_text === false) {
      this.setState({ contact_text: true });
    } else {
      this.setState({ contact_text: false });
    }
  };

  DisplayBioInput = (e) => {
    if (this.state.bio_text === false) {
      this.setState({ bio_text: true });
    } else {
      this.setState({ bio_text: false });
    }
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
        alert("Invalid email or already taken");
      });
  };

  ChangeName = (e) => {
    e.preventDefault();
    const change = {
      id: this.props.auth.user.id,
      name: this.state.change_name,
    };
    axios
      .post("/api/recruiters/change_name", change)
      .then((res) => {
        axios
          .post("/api/recruiters/get_email", { id: this.props.auth.user.id })
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

  ChangeContact = (e) => {
    e.preventDefault();
    const change = {
      id: this.props.auth.user.id,
      contact: this.state.change_contact,
    };
    axios
      .post("/api/recruiters/change_contact", change)
      .then((res) => {
        axios
          .post("/api/recruiters/get_profile", { id: this.props.auth.user.id })
          .then((user) => {
            this.setState({
              contact: user.data.contact,
              bio: user.data.bio,
              contact_text: false,
            });
          });
      })
      .catch((err) => {
        this.setState({ contact_text: false });
        console.log(err);
      });
    this.setState({ change_contact: "" });
  };

  ChangeBio = (e) => {
    e.preventDefault();
    const change = {
      id: this.props.auth.user.id,
      bio: this.state.change_bio,
    };
    axios
      .post("/api/recruiters/change_bio", change)
      .then((res) => {
        axios
          .post("/api/recruiters/get_profile", { id: this.props.auth.user.id })
          .then((user) => {
            this.setState({
              contact: user.data.contact,
              bio: user.data.bio,
              bio_text: false,
            });
          });
      })
      .catch((err) => {
        this.setState({ bio_text: false });
        alert("Word limit: 250 words");
        console.log(err);
      });
    this.setState({ change_bio: "" });
  };

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };
  render() {
    let { name_text, email_text, contact_text, bio_text } = this.state;
    return (
      <div className="container">
        <hr />
        <div>
          <b>Name: </b>
          {this.state.name}
          <b> </b>
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
        <br />
        <hr />
        <br />
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
        <br />
        <hr />
        <br />
        <div>
          <b>Contact: </b>
          {this.state.contact}
          <b> </b>
          <form onSubmit={this.ChangeContact}>
            {contact_text && (
              <input
                id="change_contact"
                onChange={this.onChange}
                type="text"
              ></input>
            )}
            {contact_text && (
              <button class="waves-effect waves-light btn-small" type="submit">
                Apply
              </button>
            )}
          </form>
          {!contact_text && (
            <button
              class="waves-effect waves-light btn-small"
              onClick={this.DisplayContactInput}
            >
              Change
            </button>
          )}
        </div>
        <br />
        <hr />
        <br />
        <div>
          <b>Bio: </b>
          {this.state.bio}
          <b> </b>
          <form onSubmit={this.ChangeBio}>
            {bio_text && (
              <input
                id="change_bio"
                onChange={this.onChange}
                type="text"
              ></input>
            )}
            {bio_text && (
              <button class="waves-effect waves-light btn-small" type="submit">
                Apply
              </button>
            )}
          </form>
          {!bio_text && (
            <button
              class="waves-effect waves-light btn-small"
              onClick={this.DisplayBioInput}
            >
              Change
            </button>
          )}
        </div>
        <br />
        <br />
        <br />
        <br /> <hr />
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
ReProfile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logoutUser })(ReProfile);
