import React,{useState,useEffect} from 'react';
import { ThemeProvider,makeStyles,createMuiTheme  } from '@material-ui/core/styles';

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
    width: 140,
  },
  modal:{
    backgroundColor: theme.palette.background.paper,
  }
}));

export default function App() {
  const classes = useStyles();
  const [flag,setflag]=useState(true);
  const [accident_data,setaccident_data]=useState([]);
  const [hospital_id, sethospital_id] = useState("");
  const [loader, setloader] = useState(0);
  const [password, setpassword] = useState("");
  const [lat, setlat] = useState("");
  const [lon, setlon] = useState("");
  const [Address, setAddress] = useState("");
  const [hospital_name, sethospital_name] = useState("");
  const [device_id, setdevice_id] = useState("");
  const [name, setname] = useState("");
  const [age, setage] = useState("");
  const [gender, setgender] = useState("");
  const [father_name, setfather_name] = useState("");
  const [mother_name, setmother_name] = useState("");
  const [blood_group, setblood_group] = useState("");

  const [bp, setbp] = useState("");
 
  const [open,setOpen]=useState(false);
  useEffect(()=>{





    if(flag){


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

			console.log (response.data)

      setaccident_data(response.data)
      setData(response.data)
      setflag(false)
		})

   
    }
  },[flag,open,loader])
    const [columns, setColumns] = useState([
      { title: 'Election Day ', field: 'date' },
      { title: 'Status', field: 'status'},

 



    ]);
    
 const [data, setData] = useState([ 
  ]);
  const [data1, setData1] = useState([]);

  
  return (
      <ThemeProvider theme={theme}>
        
      <MaterialTable
      title="CANDIDATE DETAILS"
      columns={columns}
      data={data}
      editable={{
        onRowUpdate: (newData, oldData) =>
        new Promise((resolve, reject) => {

          // console.log (newData)

   
          setTimeout(() => {
            const dataUpdate = [...data];
            const index = oldData.tableData.id;
            dataUpdate[index] = newData;
            // setData([...dataUpdate]);


            console.log ("++++++++++++++++++++++++++")
            console.log (newData)
            console.log ("++++++++++++++++++++++++++")
    
          // this.props.callback(FoodDetails)
        const options = {
            url: "http://localhost:5008/election_day_api/"+ newData._id,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
               'Authorization': 'Bearer ' + window.localStorage.getItem('codeofauth')
            },
            data: JSON.stringify(newData)
        };

     
        axios(options)
            .then(response => {

              console.log (response.data)
              setflag(true)
                  // setloader(loader+1)
            });
            
            resolve();
          }, 1000)
        }),
        
      }}
      options={{
        actionsColumnIndex: -1,
		// paging: false  
	
	}}

    
      />
  </ThemeProvider>)
}