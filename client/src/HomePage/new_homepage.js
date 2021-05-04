import React, { useState, useEffect, useStyles, useRef } from 'react';
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
import { set } from 'js-cookie';
import { useLocation } from "react-router-dom";
const qs = require('querystring')

export default function HomePage() {
    const [loading,setLoading] = useState(false)
    const [videoID,setVideoID] = useState("https://user-upload-videos-iitrpr.s3.us-east-2.amazonaws.com/videos/9c7dc8c4-b9ed-4154-935a-f53c000a1fcc/8340c4f7-338f-43f5-9318-04398e3a1bd4.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX3SYYYONN5OJIBE5%2F20210503%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20210503T174737Z&X-Amz-Expires=604800&X-Amz-Signature=0155269d01cd9aecd3ae846c0409ae21e8ba39107a3f33484fcb678689cd2851&X-Amz-SignedHeaders=host")
    // const [tempID, setTempID] = useState("")
    const [selectedFile , setselectedFile] = useState(null)
    const [searchText, setSearchText] = useState("")
    const videoRef = useRef();
    const [vttFile, setVTT] = useState("asdfklj asdlfkja dfaldkfj <mark>asdfj</mark>");//useState("https://user-upload-videos-iitrpr.s3.us-east-2.amazonaws.com/transcripts/1620068608734.vtt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX3SYYYONN5OJIBE5%2F20210503%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20210503T190457Z&X-Amz-Expires=604800&X-Amz-Signature=94c999b10b71245387f95878307af146545f175f13e364a1e567e4e48ea21455&X-Amz-SignedHeaders=host")
    const [get_sub_out, outset] = useState("")
    const [newText, setText] = useState()
    const [isDone,setIsDone] = useState(false)
    const [ids, setID] = useState([]);
    const history = useHistory();
    const location = useLocation();
    const [subID,setSubID] = useState(0)
    const colorChanger = (timestamp)=>{
      document.getElementById(timestamp).style.color = "red";
    }
    useEffect(()=>{
      console.log("pname:",location.pathname)
      if(location.state && location.state.video_obj)
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
            // setVideoID(response.data.video_link)outset(response)
                      console.log("Get Sub File:",response)
                      const searchBody = {
                          sub_id: subID,
                          search_text: searchText
                      };
                      setText(response.data.split ('\n\n').map ((item, i) => {
                        var v1 = item.indexOf('-->');
                        if(v1 == -1 && i==0){
                          return (<div alignContent = "center"><p key = {i}>Captions</p><br></br></div>);
                        }
                        if(i == 1){
                          return <p></p>;
                        }
                        var tmp = v1;
                        while(tmp>=0 && item[tmp]!='\n'){
                        	tmp -=1;
                        }
                        var st = tmp+1;
                        tmp = v1;
                        while(tmp<item.length && item[tmp]!='\n'){
                        	tmp+=1;
                        }
                        var en = tmp-1;
                        var timestamp = item.substring(st,en+1);
                        var color = "black";
                        // console.log(timestamp)
                        setID((old_id)=>{
                          return [...old_id, timestamp];
                        })
                        return (<div><p id = {timestamp}>{item}</p><br></br></div>);
                      }));

                      //search query here
                      setLoading(false)
                      console.log(searchBody);
                      axios.post("https://search-the-video-for-text-soft.herokuapp.com/api/v1/search_query", qs.stringify(searchBody),{
                        headers: {
                          'accept': 'application/json',
                          'Accept-Language': 'en-US,en;q=0.8',
                          "x-access-token": document.cookie,
                          'Content-Type': 'application/x-www-form-urlencoded'
                        }
                      }).then((response) => {
                        console.log("idhar aa gaya")
                        console.log(response.data.result)
                        var obj = JSON.parse(response.data.result)
                        var new_id = [obj["time-stamp-1"], obj["time-stamp-2"], obj["time-stamp-3"]]
                        console.log(ids)
                        console.log(new_id)
                        if(document.getElementById(new_id[2])!=null){
                          document.getElementById(new_id[2]).style.color = "red";
                        }
                        if(document.getElementById(new_id[1])!=null){
                          document.getElementById(new_id[1]).style.color = "blue";
                        }
                        if(document.getElementById(new_id[0])!=null){
                          document.getElementById(new_id[0]).style.color = "green";
                        }
                      }).catch((error) =>{
                        console.log(error)
                    })
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
          var tempID;
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
              tempID = response.data.video_link
            }).catch((error) => {
                console.log(error)
            })
            console.log([job_id])
                // console.log(tries);
            const subBody = {
                jobID:job_id
            }
            var interval1 = setInterval(function(){ axios.post("https://search-the-video-for-text-soft.herokuapp.com/api/v1/get_sub_file", qs.stringify(subBody), {
                headers: {
                  'accept': 'application/json',
                  'Accept-Language': 'en-US,en;q=0.8',
                  "x-access-token": document.cookie,
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              })
                .then((response) => {
                  if(response.status == 200){
                      outset(response)
                      console.log("Get Sub File:",response)
                      const searchBody = {
                          sub_id: job_id,
                          search_text: searchText
                      };
                      setText(response.data.split ('\n\n').map ((item, i) => {
                        var v1 = item.indexOf('-->');
                        if(v1 == -1 && i==0){
                          return (<div alignContent = "center"><p key = {i}>Captions</p><br></br></div>);
                        }
                        if(i == 1){
                          return <p></p>;
                        }
                        var tmp = v1;
                        while(tmp>=0 && item[tmp]!='\n'){
                        	tmp -=1;
                        }
                        var st = tmp+1;
                        tmp = v1;
                        while(tmp<item.length && item[tmp]!='\n'){
                        	tmp+=1;
                        }
                        var en = tmp-1;
                        var timestamp = item.substring(st,en+1);
                        var color = "black";
                        // console.log(timestamp)
                        setID((old_id)=>{
                          return [...old_id, timestamp];
                        })
                        return (<div><p id = {timestamp}>{item}</p><br></br></div>);
                      }));

                      //search query here
                      setLoading(false)
                      console.log(searchBody);
                      axios.post("https://search-the-video-for-text-soft.herokuapp.com/api/v1/search_query", qs.stringify(searchBody),{
                        headers: {
                          'accept': 'application/json',
                          'Accept-Language': 'en-US,en;q=0.8',
                          "x-access-token": document.cookie,
                          'Content-Type': 'application/x-www-form-urlencoded'
                        }
                      }).then((response) => {
                        console.log("idhar aa gaya")
                        console.log(response.data.result)
                        var obj = JSON.parse(response.data.result)
                        var new_id = [obj["time-stamp-1"], obj["time-stamp-2"], obj["time-stamp-3"]]
                        console.log(ids)
                        console.log(new_id)
                        if(document.getElementById(new_id[2])!=null){
                          document.getElementById(new_id[2]).style.color = "red";
                        }
                        if(document.getElementById(new_id[1])!=null){
                          document.getElementById(new_id[1]).style.color = "blue";
                        }
                        if(document.getElementById(new_id[0])!=null){
                          document.getElementById(new_id[0]).style.color = "green";
                        }
                      }).catch((error) =>{
                        console.log(error)
                    })
                      console.log("here")
                    clearInterval(interval1)
                    setVideoID(tempID)
                    // console.log(videoID)
                  // setVideoID(response.data.video_link)
                }
                else{
                    console.log ("else")
                }
              }).catch((error) =>{
                  console.log("asdfasdfasdf")
                  setTimeout(function(){}, 3000);
              }) }, 3000);
            
            // }
              
    
        }).catch((error) => {
          //handle error
        });
    }}
    useEffect(() => {
        videoRef.current.load()
    }, [videoID])
    const handleChange = (event)=>{
        setSearchText(event.target.value)
    };
    
    // var caption1 = document.getElementById("updated_t");
    // caption1.innerHTML = "adsflkjadsf" + "<mark>" + "asdfkljasdf" + "</mark>";
    return (
        <div style={{width: "100%", overflow:"auto", display: "flex",flexDirection: "column",alignContent: "center",justifyContent: "center"}}>
            <div style={{padding: "0px", border: "0px solid black", width: "100%"}}>
                <div class="topnav" marginLeft= "30%">
                    <a class="active">Home</a>
                    <a onClick={()=>(history.push("/vhistory"))}>Video History</a>
                </div>
            </div>
            <div style={{padding: "1%", border: "0px solid black",borderRadius: "10px", width: "80%", marginLeft: "10%", marginTop: "10px"}}>
                
                <div style={{padding: "0%", width: "100%",boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",display: "flex", justifyContent:"center",margin: "10px 0px" }}>
                    {/* <iframe width = "100%" height="535" src = {videoID} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Embedded youtube"><track default kind = "captions" srclang = "en" src = "../../../server/search_service/transcribed_text.vtt"></track></iframe> */}
                    <video controls id = "mainVideo" width = "80%" height = "590" ref = {videoRef} preload = "metadata">
                        <source src = {videoID}></source>
                        {/* <track default label = "English" kind = "captions" srclang = "en" src = "https://www.iandevlin.com/html5test/webvtt/upc-video-subtitles-en.vtt"></track> */}
                    </video>
                    <div id = "updated_t" width = "20%" height = "590" style = {{background:"white", color:"black", maxHeight:"590px", overflow:"auto"}}><textField>{newText}</textField>
                    {/* <Button variant = "contained" color = "secondary" onClick = {
                      (event) =>{
                        document.getElementById("00:00:14.000 --> 00:00:16.000").style.color = "red";
                      }
                    }></Button> */}
                    </div>
                </div>
                <div style={{padding: "1%", width: "100%",display: "flex", justifyContent:"center",margin: "10px 0px"  }}>
                    <Button variant="contained" color="primary" component = "label"><input id="inputFile" hidden type="file"
                        onChange = {
                        (event)=>
                        {
                            console.log(videoID)
                            console.log("Uploading")
                            // console.log(document.cookie)
                            setselectedFile(event.target.files[0])
                        }
                        }/>Upload File
                    </Button>
                </div>
                <div style={{padding: "0%", width: "100%",display: "flex", justifyContent:"center",margin: "10px 0px"  }}>
                    <input type="text" className="form-control" padding = "1%" id="formGroupExampleInput" placeholder = "Search Text" onChange = {handleChange}/>
                </div>
                <div style={{padding: "1%", width: "100%",display: "flex", justifyContent:"center",margin: "10px 0px"  }}>
                    {
                      loading?
                      <Loader
                        type="Puff"
                        color="#00BFFF"
                        height={100}
                        width={100}
                //timeout={3000} //3 secs
                        />
                        :
                      <Button variant="contained" color="primary">
                        <div
                            onClick={async ()=>{
                            setLoading(true)
                            console.log("Next");
                            console.log(searchText);
                            uploadHandler();
                            }}>
                            Search
                        </div>
                    </Button>
                  }
                </div>
            </div>
        </div>
    );
}
