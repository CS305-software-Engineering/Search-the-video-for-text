import React from 'react';
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
import { makeStyles } from '@material-ui/core/styles';
import { Link as ReactLink } from "react-router-dom";
import YouTubePlayer from "react-player/lib/players/YouTube";
import './homepage.css';
import { Input } from '@material-ui/core';

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
        src={`https://www.youtube.com/embed/rokGy0huYEA`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
        />
        </div>
        </div>
        </div>

        <div className="form-group" class="box2">
          <label htmlFor="formGroupExampleInput" style={{marginLeft:"350px"}}>Video URL&emsp;</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput"/>
    </div>

    <div className="form-group" class="box3">
          <label htmlFor="formGroupExampleInput" style={{marginLeft:"340px"}}>Search Text&emsp;</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput"/>
    </div>



      </div>
  )
}