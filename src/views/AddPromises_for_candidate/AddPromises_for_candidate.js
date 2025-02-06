import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Colors from "../Configuration/Colors";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function AddPromises_for_candidate() {
  const classes = useStyles();
  const [value, setValue] = React.useState("");
  const [data, setdata] = React.useState([]);
  const [promisesdata, setpromisesdata] = React.useState([]);
  const [flag, setflag] = React.useState(0);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    const options = {
      url: "http://localhost:5008/candidate_create_api",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(options).then((response) => {
      // console.log (response.data)
      var api_data = response.data.filter(
        (item) => item._id == localStorage.getItem("userid")
      );

      console.log(api_data[0].promises);
      // console.log (api_data.data)
      setpromisesdata(api_data[0].promises);
      setdata(api_data[0]);
      setflag(false);
    });
  }, [flag]);

  function addpromises() {
    if (value !== "") {
      console.log(value);

      var arr = promisesdata;

      arr.push(value);

      console.log("))))))))))))))");

      const test = data;
      var value1 = promisesdata;
      test.promises = value1;
      console.log(data);

      console.log("))))))))))))))");

      //   const promisesupdate = {

      //   }

      const options = {
        url:
          "http://localhost:5008/candidate_create_api/" +
          localStorage.getItem("userid"),
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("codeofauth"),
        },
        data: JSON.stringify(data),
      };

      axios(options).then((response) => {
        setValue("");
        console.log(response.data);
        setflag(flag + 1);
      });
    } else {
      alert("Please enter Promise and proceed ..");
    }
  }

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <h1 style={{ textAlign: "center", padding: 20, color: "white",fontFamily:'Poppins-SemiBold' }}>
          Add Promises
        </h1>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              id="outlined-multiline-static"
              label="Add Promises"
              multiline
              rows={4}
              defaultValue="Add Promises"
              variant="outlined"
              value={value}
              onChange={handleChange}
              style={{ width: "60%", marginLeft: 30, backgroundColor: "white",fontFamily:'Poppins-SemiBold'  }}
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 30, marginLeft: "40%",fontFamily:'Poppins-SemiBold'  }}
              onClick={addpromises}
            >
              Save Promise
            </Button>
          </Grid>

          <Grid container spacing={3} style={{ marginLeft: 10 }}>
            <Grid item xs={11}>
              {promisesdata.map((data) => {
                return (
                  <Paper
                    className={classes.paper}
                    style={{ padding: 20, margin: 20 ,fontFamily:'Poppins-SemiBold' ,backgroundColor:Colors.primaryLite}}
                  >
                    {data}
                  </Paper>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </form>
  );
}
