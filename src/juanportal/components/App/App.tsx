import Profile from "../Profile/Profile";
import RegisterForm from "../RegisterForm/RegisterForm";
import Header from "../header/header";
import ReactDOM from "react-dom";
import React, { ReactElement } from "react";
//import Chat from '../Chat/Chat'
import { BrowserRouter as Router } from "react-router-dom";
import { Route } from "react-router";

// Header
ReactDOM.render(<Header />, document.getElementById("header"));

// Everything else
const App = (): ReactElement => {
  return (
    <Router>
      <Route path="/">
        <Profile count={5} />
      </Route>
      <Route path="/profile/id/:id" element={<Profile />} />
      {/*<Route exact path="/chat" component={Chat} />*/}
      <Route path="/profile/add" element={<RegisterForm />} />
    </Router>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
