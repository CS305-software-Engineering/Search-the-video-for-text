const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT||5000;
const path=require("path");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const UserWithDb = require("./server/controllers/User.js")
const Auth = require("./server/middleware/Auth.js");

dotenv.config();

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//middleware
app.use(cors());
app.use(express.json()); //req.body

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"client/build")));
}
console.log(__dirname);




//ROUTES//
app.post('/api/v1/users/login',UserWithDb.login);  // mobile_number , auth_token , user_type
app.post('/api/v1/users/signup',UserWithDb.create);
app.get('/api/v1/users/insert_into_history', Auth.verifyToken, UserWithDb.insert_into_history);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Search-the-video-for-text application." });
});

app.get("*",(req,res)=>{
  if(process.env.NODE_ENV==="production"){
    res.sendFile(path.join(__dirname,"client/build/index.html"));
  }
});

app.listen(PORT, () => {
  console.log('Server has started on port ' + PORT);
});


