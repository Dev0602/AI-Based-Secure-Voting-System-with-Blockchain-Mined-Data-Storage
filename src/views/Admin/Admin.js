import React,{useState,useEffect} from 'react';
import { ThemeProvider,createMuiTheme  } from '@material-ui/core/styles';

import MaterialTable from 'material-table'
import axios from 'axios';
import 'react-responsive-modal/styles.css';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Poppins-Medium',
    ]
  },
});

export default function App() {
  const [flag,setflag]=useState(true);
  const [loader, setloader] = useState(0);
  const [columns, setColumns] = useState([
    { title: 'Name', field: 'name' },
    { title: 'Age', field: 'age', type: 'numeric' },
    { title: 'Gender', field: 'gender' },
    { title: 'Phone Number', field: 'mobile_number'},
    { title: 'Father Name', field: 'father_name'},
    { title: 'Mother Name', field: 'mother_name'},
    { title: 'Constitunency', field: 'constitunency'},
    { title: 'Party Name', field: 'party_name'},
    { title: 'Status', field: 'status'},

  ]);
  
const [data, setData] = useState([ 
]);

  const [open,setOpen]=useState(false);
  useEffect(()=>{

    if(flag){


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

      setData(response.data)
      setflag(false)
		})

   
    }
  },[flag,open,loader])
   
  
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
            url: "http://localhost:5008/candidate_create_api/"+ newData._id,
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