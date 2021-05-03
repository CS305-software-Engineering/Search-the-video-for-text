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
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { Link as ReactLink } from "react-router-dom";
import YouTubePlayer from "react-player/lib/players/YouTube";
import './homepage.css';
import Loader from 'react-loader-spinner'
import axios from "axios"
import { Input } from '@material-ui/core';
import { useLocation } from "react-router-dom";
const qs = require('querystring')

export default function HomePage() {
    const [loading,setLoading] = useState(false)
    const [videoID,setVideoID] = useState("https://www.youtube.com/embed/rokGy0huYEA")
    const [selectedFile , setselectedFile] = useState(null)
    const [searchText, setSearchText] = useState("")
    const history = useHistory();
    const location = useLocation();
    const [vttFile, setVTT] = useState("WEBVTT")
    const [isDone,setIsDone] = useState(false)
    const [subID,setSubID] = useState(0)

    useEffect(()=>{
      console.log("pname:",location.pathname)
      if(location.state.video_obj)
      {
      console.log("pname:",location.state.video_obj)
      setVideoID(location.state.video_obj.link)
      setSubID(location.state.video_obj.sub_id)
      }
    })

    const uploadHandler = ()=> {
      console.log("uploading" , selectedFile);
      setLoading(true);
      if(selectedFile == null || subID != 0) 
      {
        console.log("In Else")
        const subBody = {
          jobID:subID
        }

        axios.post("https://search-the-video-for-text-soft.herokuapp.com/api/v1/get_sub_file", qs.stringify(subBody), {
          headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            "x-access-token": document.cookie,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
          .then((response) => {

            console.log("Get Sub File:",response)
            setLoading(false)
            // setVideoID(response.data.video_link)
          })

      }

      // setLoading(true);
      // console.log(searchText)
      
      if(subID === 0)
      {
      console.log("In If")
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
            console.log([job_id])
            const subBody = {
                jobID:job_id
            }
            axios.post("https://search-the-video-for-text-soft.herokuapp.com/api/v1/get_sub_file", qs.stringify(subBody), {
              headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                "x-access-token": document.cookie,
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
              .then((response) => {
    
                console.log("Get Sub File:",response)
                const searchBody = {
                    sub_id: job_id,
                    search_text: searchText
                };
                setLoading(false)
                // setVideoID(response.data.video_link)
              })

        }).catch((error) => {
          //handle error
        });
      }
      

    }
    return (
        <div style={{width: "100%", overflow:"auto", display: "flex",flexDirection: "column",alignContent: "center",justifyContent: "center"}}>
            <div style={{padding: "0px", border: "0px solid black", width: "100%"}}>
                <div class="topnav" marginLeft= "30%">
                    <a class="active">Home</a>
                    <a onClick={()=>(history.push("/vhistory"))}>Video History</a>
                </div>
            </div>
            <div style={{padding: "1%", border: "0px solid black",borderRadius: "10px", width: "60%", marginLeft: "20%", marginTop: "10px"}}>
                
                <div style={{padding: "0%", width: "100%", boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",display: "flex", justifyContent:"center",margin: "10px 0px" }}>
                    <iframe width = "100%" height="535" src = {videoID} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Embedded youtube"><track default kind = "captions" srclang = "en" src = "../../../server/search_service/transcribed_text.vtt"></track></iframe>
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
                <div style={{padding: "0%", width: "100%",display: "flex", justifyContent:"center",margin: "10px 0px"  }}>
                    <input type="text" className="form-control" padding = "1%" id="formGroupExampleInput" placeholder = "Search Text"/>
                </div>
                <div style={{padding: "1%", width: "100%",display: "flex", justifyContent:"center",margin: "10px 0px"  }}>
                    <Button variant="contained" color="primary">
                        <div
                            onClick={async ()=>{
                            setLoading(true)
                            var sentence = document.getElementById("formGroupExampleInput").value;
                            setSearchText(sentence);
                            console.log("Next");
                            console.log(searchText);
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