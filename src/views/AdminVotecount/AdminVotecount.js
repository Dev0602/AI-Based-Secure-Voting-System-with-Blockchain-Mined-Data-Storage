import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  makeStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import axios from "axios";
import "react-responsive-modal/styles.css";
import Colors from "../Configuration/Colors";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Poppins-Medium"],
  },
});
const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  paper: {
    height: 50,
    width: 140,
  },
  modal: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function App() {
  const [flag, setflag] = useState(true);
  const [loader, setloader] = useState(0);
  const [open, setOpen] = useState(false);
  const [DMKCOUNT, setDMKCOUNT] = useState(0);
  const [ADMKCOUNT, setADMKCOUNT] = useState(0);
  const [OTHERSCOUNT, setOTHERSCOUNT] = useState(0);

  useEffect(() => {
    if (flag) {
      const options = {
        url: "http://localhost:5008/checkchainvalidity",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      // console.log(options)
      axios(options).then((response) => {
        if (response.data == true) {
          alert("Block Chain is Status is Good !!");

          const options = {
            url: "http://localhost:5008/election_day_api",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          // console.log(options)
          axios(options).then((response) => {
            // console.log (response.data[0].date)

            const totalvote = {
              date: response.data[0].date,
            };

            const options = {
              url: "http://localhost:5008/vote_total_count",
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              data: JSON.stringify(totalvote),
            };

            // console.log(options)
            axios(options).then((response) => {
              console.log(response.data);

              var DMK_VOTE_COUNT = response.data.filter(
                (item) => item.party_name == "DMK"
              );
              var ADMK_VOTE_COUNT = response.data.filter(
                (item) => item.party_name == "ADMK"
              );
              var OTHERS_VOTE_COUNT = response.data.filter(
                (item) => item.party_name == "Others"
              );

              setDMKCOUNT(DMK_VOTE_COUNT.length);
              setADMKCOUNT(ADMK_VOTE_COUNT.length);

              setOTHERSCOUNT(OTHERS_VOTE_COUNT.length);
            });

            // setaccident_data(response.data)
            // setData(response.data)
            setflag(false);
          });
        } else {
          alert("Block Chain is been hacked !!");
        }
      });
    }
  }, [flag, open, loader]);



  return (
    <ThemeProvider theme={theme}>
      <center>
        <h1
          style={{
            textAlign: "center",
            color: "white",
            padding: 20,
            backgroundColor: "darkblue",
            borderRadius: 20,
            width: "80%",
            margin: 20,
            fontFamily: "Poppins-SemiBold",
          }}
        >
          ELECTION RESULTS
        </h1>
      </center>

      <center>
        <div style={{ marginTop: "10%" }}>
          <h2
            style={{
              textAlign: "center",
              color: "white",
              padding: 20,
              backgroundColor:Colors.primaryDark,
              borderRadius: 20,
              width: "50%",
              margin: 20,
              fontFamily: "Poppins-SemiBold",
            }}
          >
            DMK VOTE COUNT - {DMKCOUNT}
          </h2>
          <h2
            style={{
              textAlign: "center",
              color: "white",
              padding: 20,
              backgroundColor:Colors.primaryDark,
              borderRadius: 20,
              width: "50%",
              margin: 20,
              fontFamily: "Poppins-SemiBold",
            }}
          >
            ADMK VOTE COUNT - {ADMKCOUNT}
          </h2>
          <h2
            style={{
              textAlign: "center",
              color: "white",
              padding: 20,
              backgroundColor:Colors.primaryDark,
              borderRadius: 20,
              width: "50%",
              margin: 20,
              fontFamily: "Poppins-SemiBold",
            }}
          >
            OTHERS VOTE COUNT - {OTHERSCOUNT}
          </h2>
        </div>
      </center>
      
    </ThemeProvider>
  );
}
