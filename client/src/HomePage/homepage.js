import React,{useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useHistory } from "react-router-dom";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import FormData from "form-data";
import { makeStyles } from '@material-ui/core/styles';
import { Link as ReactLink } from "react-router-dom";
import YouTubePlayer from "react-player/lib/players/YouTube";
import './homepage.css';
import Loader from 'react-loader-spinner'
import axios from "axios"
import { Input } from '@material-ui/core';
const qs = require('querystring')

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://pbblogassets.s3.amazonaws.com/uploads/2015/08/Audio-Waveforms-Featued-Image.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor: "black",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignContent:"center",
    marginTop: theme.spacing(20),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


export default function HomePage() {
  const classes = useStyles();
  const history = useHistory();
  const [loading,setLoading] = useState(false)
  const [videoID,setVideoID] = useState("https://www.youtube.com/embed/rokGy0huYEA")
  const [selectedFile , setselectedFile] = useState(null)
  const [isDone,setIsDone] = useState(false)
  const [searchText,setSearchText] = useState("")
  const uploadHandler = ()=> {
    console.log("uploading" , selectedFile);
    if(selectedFile == null) return;

    setLoading(true);

    let data = new FormData();
    data.append('file', selectedFile, selectedFile.name);

    console.log("Here1")
    axios.post("https://search-the-video-for-text-soft.herokuapp.com/api/v1/upload_and_transcribe", data, {
      headers: {
        'accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        "x-access-token": document.cookie,
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      }
    })
      .then((response) => {
        console.log("Here1")
        console.log(response)
        let video_req_id=response.data.video_id
        let job_id=response.data.id

        const requestBody={
          video_id:video_req_id,
          key:document.cookie
        }

        console.log("REQBODY:",requestBody)

        axios.post("https://search-the-video-for-text-soft.herokuapp.com/api/v1/get_video_streaming_link", qs.stringify(requestBody), {
          headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            "x-access-token": document.cookie,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
          .then((response) => {

            console.log("Streaming Link Response:",response)
            setVideoID(response.data.video_link)
          })
          .then(()=>{
            var currentTime = new Date().getTime();

            while (currentTime + 5000 >= new Date().getTime()){}
  
      
            axios.get("https://search-the-video-for-text-soft.herokuapp.com/api/v1/get_sub_file", {
              headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                "x-access-token": document.cookie,
                "jobID":job_id,
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
              .then((response) => {
    
                console.log("Get Sub File:",response)
                setLoading(false)
                // setVideoID(response.data.video_link)
              })
  

          })
          

          
            
  
      }).catch((error) => {
        //handle error
      });
      
    
  }

  return (
      <div
      style={{backgroundRepeat:"no-repeat",backgroundImage: "url(https://cutewallpaper.org/21/website-background-images-hd/Autodesk-Wallpaper-Website-Background-Hd-Wallpapers-.jpg)",height:"1000px"}}
      >
        
        <div class="box" id="box">
          <div class="box-inner" id="box-inner">
        <div>
        {/* <YouTubePlayer style={{border:"1px solid black"}} url='https://www.youtube.com/watch?v=d46Azg3Pm4c'/> */}
        <iframe
        style={{marginLeft:"20px",marginTop:"20px"}}
        width="853"
        height="480"
        src={videoID}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
        />
        </div>
        </div>
        </div>

        <div className="form-group" class="box2">
          <label htmlFor="formGroupExampleInput" style={{marginLeft:"350px"}}>Video&emsp;&emsp;&emsp;</label>
          <Button
              variant="contained"
              component="label"
              >
              Upload File
              <input
                id="inputFile"
                type="file"
                style={{ display: "none" }}
                onChange = {
                  (event)=>
                  {
                    console.log("Uploading")
                    setselectedFile(event.target.files[0])
                  }
                }
              />
              </Button>
    </div>

    <div className="form-group" class="box3">
          <label htmlFor="formGroupExampleInput" style={{marginLeft:"340px"}}>Search Text&emsp;</label>
          <input
            onChange={(event)=>(setSearchText(event.target.value))}
            type="text"
            className="form-control"
            id="formGroupExampleInput"/>
    </div>
    <Button
    variant="contained"
    color="primary"
    style={{marginLeft:"800px",marginTop:"900px"}}
    className={classes.submit}
    onClick={()=>(history.push("/vhistory"))}
    >
      History
    </Button>
    <Button
            //type="submit"
            variant="contained"
            color="primary"
            style={{marginLeft:"20px",marginTop:"900px"}}
            className={classes.submit}
          >
            {
            loading?
            <div className={classes.spinner}>
            <Loader
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100}
                //timeout={3000} //3 secs
            />
            </div>
            :
            <div
            onClick={async ()=>{
              setLoading(true)
              uploadHandler();
            }}>
            Search</div>
            }
          </Button>
      </div>
  )
}