import React, { useState, useEffect } from 'react';
import { ThemeProvider, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { Typography, Grid, Paper, Button } from '@material-ui/core';
import { Modal } from 'react-responsive-modal';
import CapturePhoto from './CapturePhoto'
import moment from 'moment';

import MaterialTable from 'material-table'
import axios from 'axios';
import { TextField } from '@material-ui/core';
import 'react-responsive-modal/styles.css';

const theme = createMuiTheme({
    typography: {
        fontFamily: [
            'Poppins-Medium',
        ]
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
        width: 3000,
    },
    modal: {
        backgroundColor: theme.palette.background.paper,
    }
}));

export default function App() {
    const classes = useStyles();
    const [flag, setflag] = useState(true);
    const [loader, setloader] = useState(0);
    const [promisesdata, setpromisesdata] = useState([]);
    const [voteactiveflag, setvoteactiveflag] = useState("0");
    const [voteopen, setvoteopen] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {

        if (flag) {
            const options = {
                url: 'http://localhost:5008/election_day_api',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            // console.log(options)
            axios(options)
                .then(response => {
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();
                    today = yyyy + '-' + mm + '-' + dd;
                    console.log(response.data[0].date)
                    console.log(response.data[0].status)
                    if (response.data[0].date == today && response.data[0].status == "ACTIVE") {
                        console.log("Trueeeeeeeeeeeeee")
                        setvoteactiveflag(1)

                        const options = {
                            url: 'http://localhost:5008/candidate_create_api',
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }

                        // console.log(options)
                        axios(options)
                            .then(response => {

                                console.log(response.data)

                                setData(response.data)
                                setflag(false)



                            })


                    }

                    else {

                        setvoteactiveflag(0)

                        const options = {
                            url: 'http://localhost:5008/candidate_create_api',
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }

                        // console.log(options)
                        axios(options)
                            .then(response => {

                                console.log(response.data)

                                setData(response.data)
                                setflag(false)



                            })

                    }


                    // setData(response.data)
                    // setflag(false)



                })

        }
    }, [flag, open, loader])
    const [columns, setColumns] = useState([
        { title: 'Name', field: 'name' },
        { title: 'Age', field: 'age', type: 'numeric' },
        { title: 'Gender', field: 'gender' },
        { title: 'Phone Number', field: 'mobile_number' },
        { title: 'Father Name', field: 'father_name' },
        { title: 'Mother Name', field: 'mother_name' },
        { title: 'Constitunency', field: 'constitunency' },
        { title: 'Party Name', field: 'party_name' },
        { title: 'Status', field: 'status' },




    ]);

    const [data, setData] = useState([
    ]);
    const [data1, setData1] = useState([]);


    const closemodalvode = () => {


        console.log("callllllllllllllllll")
        setvoteopen(false)
    }


    return (
        <ThemeProvider theme={theme}>
            <Grid >
                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    styles={{ marginTop: 40 }}
                >

                    <h4 style={{ textAlign: 'center', color: 'grey', marginTop: 40,fontFamily:'Poppins-Medium' }}>Candidate Promises Details </h4>

                    <Grid container spacing={3} style={{ marginLeft: 10 }}>

                        {
                            promisesdata.length > 0 ? (
                                <Grid item xs={11} >
                                    {

                                        promisesdata.map((data => {
                                            return (
                                                <Paper style={{ padding: 20, margin: 20 }}>{data}</Paper>

                                            )
                                        }))
                                    }

                                </Grid>

                            ) : (

                                <Grid item xs={11} >

                                    <Paper style={{ padding: 20, margin: 20 }}>No Promises Found</Paper>


                                </Grid>
                            )

                        }

                    </Grid>
                </Modal>
            </Grid>

            <Grid >
                <Modal
                    open={voteopen}
                    onClose={() => setvoteopen(false)}
                    styles={{ marginTop: 40 }}
                >

                    <h4 style={{ textAlign: 'center', color: 'grey', marginTop: 40,fontFamily:'Poppins-SemiBold' }}>CAPTURE PHOTO FOR VOTE </h4>

                    <CapturePhoto callback={closemodalvode} />
                </Modal>
            </Grid>


            {

                voteactiveflag == 0 ? (
                    <MaterialTable
                        title="CANDIDATE LIST"
                        columns={columns}
                        data={data}
                        actions={[
                            {
                                icon: () => <Button variant="contained" color="primary">View</Button>,
                                tooltip: 'Place Vote',
                                onClick: (event, rowData) => {
                                    console.log(rowData.promises)

                                    setOpen(true)
                                    setpromisesdata(rowData.promises)

                                }
                            }


                        ]}

                        options={{
                            actionsColumnIndex: -1,
                            // paging: false 

                        }}

                    />

                ) : (
                    <MaterialTable
                        title="CANDIDATE LIST"
                        columns={columns}
                        data={data}
                        actions={[
                            {
                                icon: () => <Button variant="contained" color="primary">View</Button>,
                                tooltip: 'Edit Food',
                                onClick: (event, rowData) => {
                                    console.log(rowData.promises)

                                    setOpen(true)
                                    setpromisesdata(rowData.promises)

                                }
                            },

                            {
                                icon: () => <Button variant="contained" color="primary">VOTE</Button>,
                                tooltip: 'Edit Food',
                                onClick: (event, rowData) => {
                                    console.log(rowData)

                                    // setOpen(true)
                                    // setpromisesdata(rowData.promises)

                                    console.log(rowData.party_name)

                                    localStorage.setItem("voteparty_name", rowData.party_name);

                                    var today = new Date();
                                    var dd = String(today.getDate()).padStart(2, '0');
                                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                    var yyyy = today.getFullYear();
                                    today = yyyy + '-' + mm + '-' + dd;

                                    const vote_check_eligible = {
                                        aadhar_number: localStorage.getItem("user_aadhar_number"),
                                        date: moment().format('YYYY-MM-DD'),


                                    };



                                    const options = {
                                        url: 'http://localhost:5008/vote_check_eligible',
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        data: JSON.stringify(vote_check_eligible)

                                    }

                                    console.log(options)
                                    axios(options)
                                        .then(response => {


                                            if (response.data.response == "True") {

                                                setvoteopen(true)

                                            }

                                            else {

                                                alert("You are already submitted your vote.")

                                            }





                                        })


                                }
                            },
                        ]}

                        options={{
                            actionsColumnIndex: -1,
                            // paging: false 

                        }}

                    />
                )
            }


        </ThemeProvider>)
}
