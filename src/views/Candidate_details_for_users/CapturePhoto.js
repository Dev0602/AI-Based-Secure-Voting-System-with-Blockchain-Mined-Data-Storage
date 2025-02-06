/* eslint-disable */
import React, { useState, useEffect } from 'react';
import Webcam from "react-webcam";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import windowSize from 'react-window-size';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: "7%",
        marginTop: -12,
    },
}));

const Card = (props) => {

    const [images, setImages] = useState([]);
    const [captureEnable, setcaptureEnable] = useState(0);
    const [imagesnames, setImagesnames] = useState([]);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const timer = React.useRef();
    const classes = useStyles();
    const webcamRef = React.useRef(null);

    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
    });




    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();

        const dataa = {

            uri: imageSrc

        }



        const options = {
            method: 'POST',

            // url: "http://192.168.1.9:5000/voting",
            url: "http://localhost:5000/voting",

            data: JSON.stringify(dataa),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTkzOTI2ODAxLCJleHAiOjE1OTY1MTg4MDF9.RcKer0GIBzM-ADvpr54wEaNd1cb-hVI3VVTQUzGuczo'
            }
        };




        axios(options)
            .then(response5 => {

                console.log("+++++++++++++++dddddddddddddddd+++++++++++++++++++++++")
                console.log(response5.data)
                console.log(response5.data.success)
                console.log(localStorage.getItem("user_aadhar_number"));
                
                console.log("+++++++++++++++dddddddddddddddd+++++++++++++++++++++++")

                if (response5.data.success == "true") {

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

                            // console.log (response.data[0].date)

                            const totalvote = {

                                "date": response.data[0].date

                            }


                            const options = {
                                url: 'http://localhost:5008/vote_total_count',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                data: JSON.stringify(totalvote)

                            }

                            axios(options)
                                .then(response => {


                                    if (response.data.length > 0) {

                                        if (response5.data.success == "true" && localStorage.getItem("user_aadhar_number") == response5.data.id) {
                                            var today = new Date();
                                            var dd = String(today.getDate()).padStart(2, '0');
                                            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                            var yyyy = today.getFullYear();
                                            today = yyyy + '-' + mm + '-' + dd;

                                            const dataa = {
                                                date: moment().format('YYYY-MM-DD'),
                                                aadhar_id: localStorage.getItem("user_aadhar_number"),
                                                party_name: localStorage.getItem("voteparty_name"),
                                                index: "0",
                                                timestamp: moment().format('HH:mm'),
                                                precedingHash: "0",
                                                hash: "0",
                                                nonce: "0"
                                            }



                                            const options = {
                                                method: 'POST',

                                                url: "http://localhost:5008/vote_create",
                                                data: JSON.stringify(dataa),
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTkzOTI2ODAxLCJleHAiOjE1OTY1MTg4MDF9.RcKer0GIBzM-ADvpr54wEaNd1cb-hVI3VVTQUzGuczo'
                                                }
                                            };


                                            axios(options)
                                                .then(response => {

                                                    console.log(response.data)

                                                    props.callback("sdlskkjf")
                                                    alert("Vote placed")


                                                })


                                        }
                                        else {
                                            alert("You are already submitted your vote.")
                                        }
                                        // props.onStoreResult(imageSrc);
                                        setSuccess(true);
                                        setLoading(false);


                                    }

                                    else {

                                        if (response5.data.success == "true" && localStorage.getItem("user_aadhar_number") == response5.data.id) {
                                            console.log(localStorage.getItem("voteparty_name"));
                                            var today = new Date();
                                            var dd = String(today.getDate()).padStart(2, '0');
                                            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                            var yyyy = today.getFullYear();
                                            today = yyyy + '-' + mm + '-' + dd;

                                            const dataa = {
                                                date: moment().format('YYYY-MM-DD'),
                                                aadhar_id: "none",
                                                party_name: "none",
                                                index: "0",
                                                timestamp: moment().format('HH:mm'),
                                                precedingHash: "0",
                                                hash: "0",
                                                nonce: "0"
                                            }



                                            const options = {
                                                method: 'POST',

                                                url: "http://localhost:5008/vote_create_genesis",
                                                data: JSON.stringify(dataa),
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTkzOTI2ODAxLCJleHAiOjE1OTY1MTg4MDF9.RcKer0GIBzM-ADvpr54wEaNd1cb-hVI3VVTQUzGuczo'
                                                }
                                            };

                                            axios(options)
                                                .then(response => {

                                                    var today = new Date();
                                                    var dd = String(today.getDate()).padStart(2, '0');
                                                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                                    var yyyy = today.getFullYear();
                                                    today = yyyy + '-' + mm + '-' + dd;

                                                    const dataa = {
                                                        date: moment().format('YYYY-MM-DD'),
                                                        aadhar_id: localStorage.getItem("user_aadhar_number"),
                                                        party_name: localStorage.getItem("voteparty_name"),
                                                        index: "0",
                                                        timestamp: moment().format('HH:mm'),
                                                        precedingHash: "0",
                                                        hash: "0",
                                                        nonce: "0"
                                                    }



                                                    const options = {
                                                        method: 'POST',

                                                        url: "http://localhost:5008/vote_create",
                                                        data: JSON.stringify(dataa),
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTkzOTI2ODAxLCJleHAiOjE1OTY1MTg4MDF9.RcKer0GIBzM-ADvpr54wEaNd1cb-hVI3VVTQUzGuczo'
                                                        }
                                                    };

                                                    console.log("options")
                                                    console.log(options)
                                                    console.log("options")


                                                    axios(options)
                                                        .then(response => {

                                                            console.log(response.data)

                                                            props.callback("sdlskkjf")
                                                            alert("Vote placed")


                                                        })

                                                    setSuccess(true);
                                                    setLoading(false);


                                                })


                                        }
                                        else {
                                            alert("You are already submitted your vote.")
                                        }

                                    }

                                })




                        })


                }

                else {
                    // console.log (response.data)
                    setSuccess(true);
                    setLoading(false);
                    alert("Please focus camera..")



                }



                // images.push(response.data.data)
                // imagesnames.push(response.data.names)



                // console.log (response.data.data)


            })



    }


    const finaldatapass = () => {

        props.onStoreEmbeddedCodeForImages_from_redux.map((reduxvalue) => {
            images.push(reduxvalue.embeddings)


        })



        props.onStoreEmbeddedNames_from_redux.map((reduxnames) => {
            imagesnames.push(reduxnames.embeddings_names)


        })




    }
    const handleButtonClick = () => {

        console.log("captue clike")
        if (!loading) {
            setSuccess(false);
            setLoading(true);

        }

        capture();
    };


    const videoConstraints = {
        width: props.windowWidth / 2 - 40,
        height: 500,
        facingMode: "user",
        borderRadius: 20
    };
    const videoConstraints1 = {
        width: props.windowWidth,
        height: 500,
        facingMode: "user",
    };
    if (props.windowWidth > 600) {
        return (
            < div style={{ marginTop: 20 }}>
                <Webcam
                    audio={false}
                    height={500}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={props.windowWidth / 4 + 20}
                    videoConstraints={videoConstraints}
                />



                <div className={classes.wrapper}>

                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: 20 }}
                        // className={buttonClassname}
                        disabled={loading}
                        onClick={handleButtonClick}
                    >
                        Capture photo
                    </Button>
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    {/* <Button variant="contained" color="primary" style={{ marginLeft: 20, marginTop: 20 }} onClick={finaldatapass}>
                        Submit
            </Button> */}
                </div>





            </ div>
        );
    }
    else {
        return (
            < div style={{
                marginTop: 20, marginLeft: 20
            }}>
                <Webcam
                    audio={false}
                    height={500}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={props.windowWidth}
                    videoConstraints={videoConstraints1}
                />
                <button onClick={capture}>Capture photo</button>




            </ div>
        );
    }
};

export default windowSize(Card);
