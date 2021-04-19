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

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//middleware

app.use(express.json()); //req.body

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"client/build")));
}
console.log(__dirname);


//ROUTES//
app.post('/api/v1/users/login',UserWithDb.login);
app.post('/api/v1/users/signup',UserWithDb.create);


app.use('/api/v1/upload_and_transcribe',require('./server/router/upload_and_transcribe.js'));
app.use('/api/v1/get_sub_file', require('./server/router/get_sub_file.js'));
app.use('/api/v1/get_video_streaming_link', require('./server/router/get_video_streaming_link.js'));
app.use('/api/v1/get_my_history', require('./server/router/get_my_history'));
app.use('/api/v1/get_search_queries_history', require('./server/router/get_search_queries_history'));
app.use('/api/v1/search_query', require('./server/router/search_query'));


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




// TESTING S3 UPLOAD SERVICE

// const S3_Service = require("./server/controllers/Storage Service/s3_bucket_operations.js")
// const fs = require('fs');
// const fileContent = fs.readFileSync('./package.json')
// S3_Service.uploadObject('package111.json',fileContent)

// S3_Service.checkObject('package111.json').then(res => {
//   console.log(res)
// })

// S3_Service.getSignedURL('package111.json').then( url => {
//   console.log(url)
// })

