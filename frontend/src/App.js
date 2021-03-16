import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import AppPrivateRoute from "./components/private-route/AppPrivateRoute";
import RePrivateRoute from "./components/private-route/RePrivateRoute";
import recruiterDashboard from "./components/dashboard/recruiterDashboard";
import applicantDashboard from "./components/dashboard/applicantDashboard";
import jobList from "./components/dashboard/applicant/applicant_jobList";
import AppProfile from "./components/dashboard/applicant/applicant_profile";
import ReProfile from "./components/dashboard/recruiter/recruiter_profile";
import NewJob from "./components/dashboard/recruiter/new_job";
import MyApplication from "./components/dashboard/applicant/my_applications";
import RejobList from "./components/dashboard/recruiter/job_list";
import AllApp from "./components/dashboard/recruiter/view_applicant";
import EmployeeList from "./components/dashboard/recruiter/employees";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded)); // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser()); // Redirect to login
    window.location.href = "./login";
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch>
              {/* <PrivateRoute exact path="/recruiterDashboard" component={recruiterDashboard} /> */}
              <AppPrivateRoute
                exact
                path="/applicantDashboard"
                component={jobList}
              />
              <AppPrivateRoute
                exact
                path="/app_profile"
                component={AppProfile}
              />
              <AppPrivateRoute
                exact
                path="/my_application"
                component={MyApplication}
              />
              <RePrivateRoute exact path="/re_profile" component={ReProfile} />
              <RePrivateRoute exact path="/new_job" component={NewJob} />
              <RePrivateRoute exact path="/job_list" component={RejobList} />
              <RePrivateRoute path="/applicants/:job_id" component={AllApp} />
              <RePrivateRoute path="/employees" component={EmployeeList} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
