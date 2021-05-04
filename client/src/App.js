import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SignInSide from "./LoginSignup/login.js"
import HomePage from "./HomePage/homepage.js";
import HomePage1 from "./HomePage/new_homepage.js";
import VideoHistory from "./VideoHistory/videohistory.js";

const App = () => {
  return (
    <Router >
      <Route exact path="/" component={SignInSide} />
      <Route exact path="/home" component={HomePage1} />
      <Route exact path="/vhistory" component={VideoHistory} />
    </Router>
  )

}

export default App;
