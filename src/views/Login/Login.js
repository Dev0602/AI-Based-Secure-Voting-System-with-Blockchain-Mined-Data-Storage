import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import axios from "axios";
import moment from "moment";
import Colors from "../Configuration/Colors";



const useStyles = makeStyles((theme) => ({
  paper: {
    // marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    marginTop: "10%",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    // marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn(props) {
  const classes = useStyles();
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [usertype, setusertype] = useState("Admin");
  const [currentdate, setcurrentdate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const usernamehandleChange = (event) => {
    setusername(event.target.value);
  };

  const passwordhandleChange = (event) => {
    setpassword(event.target.value);
  };

  const onchangeusertype = (event) => {
    setusertype(event.target.value);
  };

  function login() {
    if (username == "") {
      alert("Please enter Username ");
    } else if (password == "") {
      alert("Please enter Password ");
    } else if (
      username == "admin" &&
      password == "admin" &&
      usertype == "Admin"
    ) {
      const options = {
        url: "http://localhost:5008/election_day_api",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      // console.log(options)
      axios(options).then((response) => {
        console.log(response.data);

        if (response.data.length > 0) {
          localStorage.setItem("phonenumber", username);
          localStorage.setItem("login", 0);
          localStorage.setItem("usertype", "Admin");

          setTimeout(() => {
            props.history.push("./Admin");
          }, 1000);
        } else {
          const userverify = {
            date: currentdate,
          };

          const options = {
            url: "http://localhost:5008/election_day_api/",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify(userverify),
          };

          console.log(options);
          axios(options).then((response) => {
            localStorage.setItem("phonenumber", username);
            localStorage.setItem("login", 0);
            localStorage.setItem("usertype", "Admin");

            setTimeout(() => {
              props.history.push("./Admin");
            }, 1000);
          });
        }
      });
    } else if (username !== "" && password !== "" && usertype == "User") {
      const userverify = {
        aadhar_number: username,
        password: password,
      };

      const options = {
        url: "http://localhost:5008/user_create_api_login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(userverify),
      };

      console.log(options);
      axios(options).then((response) => {
        if (response.status == 200) {
          if (response.data.response == "True") {
            localStorage.setItem("usertype", "UserCandidate");
            localStorage.setItem("user_aadhar_number", username);

            setTimeout(() => {
              props.history.push("./Candidate_details_for_users");
            }, 1000);
          } else {
            alert("User not found");
          }
        } else {
          alert("Network error please try again later");
        }
      });
    } else if (username !== "" && password !== "" && usertype == "Candidate") {
      const userverify = {
        aadhar_number: username,
        password: password,
      };

      const options = {
        url: "http://localhost:5008/candidate_create_api_login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(userverify),
      };

      axios(options).then((response) => {
        if (response.status == 200) {
          if (response.data.response == "True") {
            localStorage.setItem("userid", response.data.data[0]._id);

            localStorage.setItem("usertype", "AddPromises_for_candidate");
            localStorage.setItem("userid", response.data.data[0]._id);

            setTimeout(() => {
              props.history.push("./AddPromises");
            }, 1000);
          } else {
            alert("User not found candidate");
          }
        } else {
          alert("Network error please try again later");
        }
      });
    } else {
      alert("Entered Username and Password is incorrect");
    }
  }

  function Candidatesignup() {
    props.history.push("./AddCandidate");
    localStorage.setItem("phonenumber", username);
    localStorage.setItem("login", 0);

    localStorage.setItem("usertype", "candidate");
  }

  function Usersignup() {
    props.history.push("./Addusers");
    localStorage.setItem("phonenumber", username);
    localStorage.setItem("login", 0);
    localStorage.setItem("usertype", "user");
  }

  var bg = require("./voting.jpeg");

  return (
    <div
      className="background-image"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div style={{ marginLeft: "72%" }}>
        <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => {
            Candidatesignup();
          }}
          style={{
            right: 10,
            backgroundColor: Colors.primaryDark,
            fontFamily: "Poppins-SemiBold",
          }}
        >
          CANDIDATE SIGN UP
        </Button>

        <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          style={{
            backgroundColor: Colors.primaryDark,
            fontFamily: "Poppins-SemiBold",
          }}
          onClick={() => {
            Usersignup();
          }}
        >
          USER SIGN UP
        </Button>
      </div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <h5
            style={{
              textAlign: "center",
              fontSize: 25,
              color: Colors.primaryDark,
              marginTop: "20%",
              fontFamily: "Poppins-SemiBold",
            }}
          >
            {" "}
            E - VOTING BALLOT
          </h5>{" "}
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <h1
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "bold",
              color: Colors.primaryDark,
              marginTop: "5%",
              fontFamily: "Poppins-SemiBold",
            }}
          >
            {" "}
            LOGIN
          </h1>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="Username"
              label="User Name"
              name="Username"
              autoFocus
              value={username}
              onChange={usernamehandleChange}
              InputProps={{
                style: {
                  fontFamily: "Poppins-Medium",
                },
              }}
              InputLabelProps={{
                style: { fontFamily: "Poppins-Medium" },
              }}
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
              value={password}
              onChange={passwordhandleChange}
              InputProps={{
                style: {
                  fontFamily: "Poppins-Medium",
                },
              }}
              InputLabelProps={{
                style: { fontFamily: "Poppins-Medium" },
              }}
            />

            <Grid item xs={12} sm={12} style={{ marginTop: 20 }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel
                  id="demo-simple-select-outlined-label"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  User Type
                </InputLabel>
                <Select
                  inputProps={{
                    id: "deviceSource-native-select",
                    name: "deviceSource",
                  }}
                  value={usertype}
                  onChange={onchangeusertype}
                  label="User Type"
                  MenuProps={{
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    getContentAnchorEl: null,
                  }}
                  required
                >
                  <MenuItem
                    value={"User"}
                    style={{ fontFamily: "Poppins-SemiBold" }}
                  >
                    Normal User{" "}
                  </MenuItem>
                  <MenuItem
                    value={"Admin"}
                    style={{ fontFamily: "Poppins-SemiBold" }}
                  >
                    Admin User
                  </MenuItem>
                  <MenuItem
                    value={"Candidate"}
                    style={{ fontFamily: "Poppins-SemiBold" }}
                  >
                    Candidate User
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Button
              variant="contained"
              color="primary"
              className={classes.submit}
              style={{
                margin: 10,
                right: 10,
                marginTop: 20,
                backgroundColor: Colors.primaryDark,
                width: 150,
                fontFamily: "Poppins-SemiBold",
              }}
              onClick={() => {
                login();
              }}
            >
              LOG IN
            </Button>

            <h1></h1>

            <h1></h1>
            <h1></h1>
            <h1></h1>
            <h1></h1>
          </form>
        </div>
      </Container>
    </div>
  );
}
