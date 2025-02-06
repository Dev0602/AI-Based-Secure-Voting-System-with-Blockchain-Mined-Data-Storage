import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { CircularProgress } from "@material-ui/core";
import Colors from "../Configuration/Colors";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(),
    minWidth: 600,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(0),
    },
  },
}));
export default function AddUser(props) {
  const classes = useStyles();
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [loader, setloader] = useState(0);
  const [gender, setgender] = useState("Male");
  const [age, setage] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  const [aadhar, setaadhar] = useState("");
  const [MotherName, setMotherName] = useState("");
  const [FatherName, setFatherName] = useState("");
  const [address, setaddress] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleClicktest = () => {
    setloader(0);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleChange1 = (event) => {
    setName(event.target.value);
  };
  const handleChange2 = (event) => {
    setPassword(event.target.value);
  };

  const handleChange3 = (event) => {
    setgender(event.target.value);
  };

  const handleChange4 = (event) => {
    if (event.target.value.length <= 2) {
      setage(event.target.value);
    }
  };

  const handleChange5 = (event) => {
    setphonenumber(event.target.value);
  };

  const handleChange6 = (event) => {
    setaadhar(event.target.value);
  };

  const handleChange7 = (event) => {
    setMotherName(event.target.value);
  };

  const handleChange8 = (event) => {
    setFatherName(event.target.value);
  };

  const handleChange11 = (event) => {
    setaddress(event.target.value);
  };

  async function CreateUser() {
    // if (Name !== "" && Password !== "" && age !== "" && aadhar !== "" && MotherName !== "" && FatherName !== "" && repeatpassword !== "" && party !== "" && constituency !== "" && skin !== "" && insulin !== "" && purpose !== "" && address !== "" && city !== "" && state !== "" && zip !== "" && country !== "" ){

    if (Name !== "") {
      setloader(1);

      const token = {
        name: Name,
        age: age,
        gender: gender,
        mother_name: MotherName,
        father_name: FatherName,
        mobile_number: phonenumber,
        aadhar_number: aadhar,
        password: Password,
        Address: address,
      };

      console.log("++++++++++++++++++++++++++++++++++++++++++");
      console.log(token);
      console.log("++++++++++++++++++++++++++++++++++++++++++");

      const options = {
        // url: 'http://localhost:5005/location',
        url: "http://localhost:5008/user_create_api",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(token),
      };

      console.log(options);
      axios(options).then((response) => {
        if (response.status == 200) {
          handleClicktest();
        } else {
          alert("Network error please try again later");
        }
        // console.log(response.data)

        console.log(response.status);
      });
    } else {
      alert("Please give value for all the required fields");
    }
  }

  if (localStorage.getItem("login") == 0) {
    return (
      // <center>
      <div
        style={{
          alignItems: "center",
          marginLeft: "5%",
          marginRight: "5%",
          marginTop: 40,
          backgroundColor: Colors.primaryLite,
        }}
      >
        <div className={classes.root}>
          <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              Canditate Given Informations are save successfully
              !!!!!!!!!!!!!!!!!!
            </Alert>
          </Snackbar>
        </div>
        <React.Fragment>
          <h2
            style={{
              textAlign: "center",
              padding: 10,
              color: Colors.primaryDark,
            }}
          >
            User Registration Form
          </h2>

          <Grid container spacing={3} style={{ marginTop: 20, padding: 20 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="Name"
                name="Name"
                label="Name"
                fullWidth
                autoComplete="given-name"
                variant="outlined"
                value={Name}
                onChange={handleChange1}
                style={{ backgroundColor: "white" }}
                InputProps={{
                  style: {
                    fontFamily: "Poppins-Medium",
                  },
                }}
                InputLabelProps={{
                  style: { fontFamily: "Poppins-Medium" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="Password"
                name="Password"
                label="Password"
                fullWidth
                autoComplete="family-name"
                variant="outlined"
                value={Password}
                onChange={handleChange2}
                style={{ backgroundColor: "white" }}
                InputProps={{
                  style: {
                    fontFamily: "Poppins-Medium",
                  },
                }}
                InputLabelProps={{
                  style: { fontFamily: "Poppins-Medium" },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="Age"
                name="Age"
                label="Age"
                fullWidth
                autoComplete="family-name"
                variant="outlined"
                value={age}
                onChange={handleChange4}
                type="number"
                inputProps={{
                  maxLength: 3,
                }}
                style={{ backgroundColor: "white" }}
                InputProps={{
                  style: {
                    fontFamily: "Poppins-Medium",
                  },
                }}
                InputLabelProps={{
                  style: { fontFamily: "Poppins-Medium" },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="demo-simple-select-outlined-label"   style={{ fontFamily: "Poppins-SemiBold" }}>
                  Gender
                </InputLabel>
                <Select
                  inputProps={{
                    id: "deviceSource-native-select",
                    name: "deviceSource",
                  }}
                  //   labelId="demo-simple-select-outlined-label"
                  //   id="demo-simple-select-outlined"
                  value={gender}
                  onChange={handleChange3}
                  label="Gender"
                  style={{ backgroundColor: "white" }}
                  
                  MenuProps={{
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    getContentAnchorEl: null,
                  }}
                  InputProps={{
                    style: {
                      fontFamily: "Poppins-Medium",
                    },
                  }}
                  InputLabelProps={{
                    style: { fontFamily: "Poppins-Medium" },
                  }}
                  required
                >
                  <MenuItem value={"Male"}  style={{ fontFamily: "Poppins-SemiBold" }}>Male</MenuItem>
                  <MenuItem value={"Female"}  style={{ fontFamily: "Poppins-SemiBold" }}>Female</MenuItem>
                  <MenuItem value={"Others"} style={{ fontFamily: "Poppins-SemiBold" }}>Others</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="FatherName"
                name="FatherName"
                label="FatherName"
                fullWidth
                autoComplete="family-name"
                variant="outlined"
                inputProps={{
                  maxLength: 10,
                }}
                value={FatherName}
                onChange={handleChange8}
                style={{ backgroundColor: "white" }}
                InputProps={{
                  style: {
                    fontFamily: "Poppins-Medium",
                  },
                }}
                InputLabelProps={{
                  style: { fontFamily: "Poppins-Medium" },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="MotherName"
                name="MotherName"
                label="MotherName"
                fullWidth
                autoComplete="family-name"
                variant="outlined"
                inputProps={{
                  maxLength: 12,
                }}
                InputProps={{
                  style: {
                    fontFamily: "Poppins-Medium",
                  },
                }}
                InputLabelProps={{
                  style: { fontFamily: "Poppins-Medium" },
                }}
                value={MotherName}
                onChange={handleChange7}
                style={{ backgroundColor: "white" }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="Phone Number"
                name="Phone Number"
                label="Phone Number"
                fullWidth
                autoComplete="family-name"
                variant="outlined"
                inputProps={{
                  maxLength: 10,
                }}
                type="number"
                value={phonenumber}
                onChange={handleChange5}
                InputProps={{
                  style: {
                    fontFamily: "Poppins-Medium",
                  },
                }}
                InputLabelProps={{
                  style: { fontFamily: "Poppins-Medium" },
                }}
                style={{ backgroundColor: "white" }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                id=" Aadhar Card Number"
                name=" Aadhar Card Number"
                label=" Aadhar Card Number"
                fullWidth
                autoComplete="family-name"
                variant="outlined"
                type="number"
                style={{ backgroundColor: "white" }}
                inputProps={{
                  maxLength: 10,
                }}
                InputProps={{
                  style: {
                    fontFamily: "Poppins-Medium",
                  },
                }}
                InputLabelProps={{
                  style: { fontFamily: "Poppins-Medium" },
                }}
                value={aadhar}
                onChange={handleChange6}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                id="address1"
                name="address1"
                label="Address"
                d
                fullWidth
                autoComplete="shipping address-line1"
                variant="outlined"
                value={address}
                onChange={handleChange11}
                style={{ backgroundColor: "white" }}
                InputProps={{
                  style: {
                    fontFamily: "Poppins-Medium",
                  },
                }}
                InputLabelProps={{
                  style: { fontFamily: "Poppins-Medium" },
                }}
              />
            </Grid>
          </Grid>
        </React.Fragment>

        {loader == 1 ? (
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress style={{ color: "red" }} size={60} />
          </Box>
        ) : null}

        <center>
          <div style={{ marginTop: 20, padding: 20 }}>
            <Button
              variant="contained"
              color="red"
              style={{
                height: 50,
                width: 200,
                borderRadius: 20,
                fontWeight: "bold",
                fontSize: 17,
                backgroundColor: "green",
                color: "white",
              }}
              onClick={() => {
                CreateUser();
              }}
            >
              SAVE DETAILS
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{
                height: 50,
                width: 200,
                borderRadius: 20,
                fontWeight: "bold",
                fontSize: 17,
                backgroundColor: Colors.buttonSecondary,
                color: "white",
                left: 20,
              }}
              onClick={() => props.history.push("./")}
            >
              CANCEL
            </Button>
          </div>
        </center>
      </div>
    );
  }
}
