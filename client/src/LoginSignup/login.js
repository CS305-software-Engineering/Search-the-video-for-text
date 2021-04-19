import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { useHistory } from "react-router-dom";
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Link as ReactLink } from "react-router-dom";
const axios = require('axios')
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

export default function SignInSide() {
  const classes = useStyles();
  const history = useHistory();
  const [signup,setSignup]=React.useState(0)
  const [emailId,setEmailId]=React.useState("")
  const [loginPWD,setLoginPWD]=React.useState("")
  const [signupPWD,setSignupPWD]=React.useState("")
  const [signupPWDCnf,setSignupPWDCnf]=React.useState("")


  function handleSubmit() {
    // event.preventDefault();
    console.log("Login:",emailId,loginPWD);
    const requestBody = {
      email: emailId,
      password: loginPWD
    }
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    axios.post('https://search-the-video-for-text-soft.herokuapp.com/api/v1/users/login', qs.stringify(requestBody), config)
    .then(function (response) {
      
        console.log(response);
        if(response.status==400){
          alert("Invalid Email/Password");
        }
<<<<<<< HEAD
        let token=response.data.token
        document.cookie=token.toString();
        console.log("Token",document.cookie)
=======
        let token=response.data.token;
>>>>>>> 133d8dfec8f914930e4b08c751addd713cb7a3f6
        let user_type=response.data.user_type;
        if(user_type=='admin'){
          console.log("Logged in as Admin");

       history.push('/home',{params:token});
        }
        else {
          console.log("Logged in as User");
          history.push('/home',{params:token});
        }
    })
    .catch(err =>{
      console.log(err);
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      }
    })
  }        
    
  function handleCreate() {
    // event.preventDefault();
    console.log("Signup",emailId,signupPWD);
    const requestBody = {
      email: emailId,
      password: signupPWD,
    }
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    axios.post('https://search-the-video-for-text-soft.herokuapp.com/api/v1/users/signup', qs.stringify(requestBody), config)
    .then(function (response) {
      
        console.log(response);
        if(response.status==400){
          console.log("Server Error");
        }
        // history.push('/home');
        setSignup(0);
    })
    .catch(err =>{
      console.log(err);
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      }
    })
    
  }


  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          {
          signup?
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          :
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          }
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(event)=>(
                setEmailId(event.target.value)
              )}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(event)=>(
                signup?
                setSignupPWD(event.target.value)
                :
                setLoginPWD(event.target.value)
              )}
            />
            {
            signup?
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirm password"
              label="Confirm Password"
              type="password"
              id="password"
              autoComplete="confirm-password"
              onChange={(event)=>(
                setSignupPWDCnf(event.target.value)
              )}
            />
            :""
            }
            {
            signup?
            ""
            :
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            }
            <li>
              <ReactLink>

                {signup?
                <Button
                //type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={()=>(
                  signupPWD===signupPWDCnf?
                  handleCreate()
                  :
                  alert("Passwords Do Not Match!")
                  )}
              >
                Sign Up
              </Button>
                :
                <Button
                  //type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={()=>(
                    handleSubmit()
                  )}
                  
                >
                  Sign In
                </Button>
                }
              </ReactLink>
            </li>  
            <Grid container>
              <Grid item xs>
                {
                signup?
                ""
                :
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
                }
              </Grid>
              <Grid item>
                {
                signup?
                <Link href="#" variant="body2"
                onClick={()=>(setSignup(0))}
                >
                  {"Have an account? Login"}
                </Link>                
                :
                <Link href="#" variant="body2"
                onClick={()=>(setSignup(1))}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
                }
              </Grid>
            </Grid>
            
          </form>
        </div>
      </Grid>
    </Grid>
  );
}