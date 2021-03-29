import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SignInSide from "./LoginSignup/login.js"
import HomePage from "./HomePage/homepage.js";

const App = () => {
  return (
  <Router >
    
    <Route exact path="/" component={SignInSide} /> 
    <Route exact path="/home" component={HomePage} />
  </Router>
)

 }

export default App;
