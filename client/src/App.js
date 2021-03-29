import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SignInSide from "./LoginSignup/login.js"


const App = () => {
  return (
  <Router >
    
    <Route exact path="/" component={SignInSide} /> 
  </Router>
)

 }

export default App;
