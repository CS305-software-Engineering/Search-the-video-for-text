import React, { useState, useEffect, useStyles } from 'react';
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

export default function HomePage() {
    const [loading,setLoading] = useState(false)
    const [videoID,setVideoID] = useState("https://www.youtube.com/embed/rokGy0huYEA")
    const [selectedFile , setselectedFile] = useState(null)
    const [isDone,setIsDone] = useState(false)
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
      
            axios.get("https://search-the-video-for-text-soft.herokuapp.com/api/v1/get_sub_file", {
              headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                "x-access-token": document.cookie,
                "jobID":job_id,
                'Content-Type': 'application/json'
              }
            })
              .then((response) => {
    
                console.log("Get Sub File:",response)
                fetch("https://user-upload-videos-iitrpr.s3.us-east-2.amazonaws.com/transcripts/1618938340830.vtt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX3SYYYONOAN3DHMX%2F20210420%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20210420T170542Z&X-Amz-Expires=604800&X-Amz-Signature=8c7e2f4c3f736e293380b774e49be7a867cc1ec4939e02ea84c23246337e1755&X-Amz-SignedHeaders=host")
                .then((response) => {
                  console.log(response)
                }
                
                )
                setLoading(false)
                // setVideoID(response.data.video_link)
              })
            
              
    
        }).catch((error) => {
          //handle error
        });
        
      
    }
    return (
        <div style={{width: "100%", height:"100vh", display: "flex",flexDirection: "column",alignContent: "center",justifyContent: "center",background: "linear-gradient(180deg, #283E51 0%, #0A2342 100%)"}}>
            <div style={{padding: "1%", border: "0px solid black",borderRadius: "10px", width: "70%", marginLeft: "15%", marginTop: "10px"}}>
                <Button variant = "contained" href = "http://localhost:3000/home" color = "secondary">Video History</Button>
                <div style={{padding: "1%", width: "100%", boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",display: "flex", justifyContent:"center",margin: "10px 0px" }}>
                    <iframe width = "95%" height="500" src = {videoID} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Embedded youtube"></iframe>
                </div>
                <div style={{padding: "1%", width: "100%",display: "flex", justifyContent:"center",margin: "10px 0px"  }}>
                    <Button variant="contained" color="primary" component = "label"><input id="inputFile" hidden type="file"
                        onChange = {
                        (event)=>
                        {
                            console.log("Uploading")
                            console.log(document.cookie)
                            setselectedFile(event.target.files[0])
                        }
                        }/>Upload File
                    </Button>
                </div>
                <div style={{padding: "1%", width: "100%",display: "flex", justifyContent:"center",margin: "10px 0px"  }}>
                    <input type="text" className="form-control" padding = "1%" id="formGroupExampleInput" placeholder = "Search Text"/>
                </div>
                <div style={{padding: "1%", width: "100%",display: "flex", justifyContent:"center",margin: "10px 0px"  }}>
                    <Button variant="contained" color="primary">
                        <div
                            onClick={async ()=>{
                            setLoading(true)
                            uploadHandler();
                            }}>
                            Search
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    );
}