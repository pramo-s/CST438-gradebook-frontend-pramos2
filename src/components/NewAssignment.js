import React  from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// eslint-disable-next-line
import Grid from '@mui/material/Grid';
// eslint-disable-next-line
import {DataGrid} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';
import {SERVER_URL} from '../constants.js';

class NewAssignment extends React.Component {
   constructor(props) {
      super(props);
      console.log("New Assignment Page "+ JSON.stringify(props.location));
     this.state = {  assignments: [], courses: [], courseNames: [], courseId: 0, assignmentName: "", dueDate: "" };
    } 
   
   componentDidMount() {
       this.fetchCourses();
    }
   
   fetchCourses = () => {
      console.log("NewAssignment.fetchCourses");
      const token = Cookies.get('XSRF-TOKEN');
      fetch(`${SERVER_URL}/course/`, 
        {  
          method: 'GET', 
          headers: { 'X-XSRF-TOKEN': token }
        })
      .then((response) => response.json()) 
      .then((responseData) => { 
        if (Array.isArray(responseData.courses)) {
          this.setState({ 
            courses: responseData.courses.map((r,index) => {
                  return {id:index, ...r};
            })
          });
        let courseNames = []
        for (let i = 0; i < this.state.courses.length; i++) {
           let temp_id = this.state.courses[i].course_id;
           let temp_name = this.state.courses[i].title;
           courseNames.push({ label: temp_name, value: temp_id });
        }
        this.setState({courseNames: courseNames}); 
        this.setState({courseId: courseNames[0].value}); 
        } else {
          toast.error("Fetch failed.", {
            position: toast.POSITION.BOTTOM_LEFT
          });
        }        
      })
      .catch(err => console.error(err));
    }
   
   
   // when user has selected a different course, update the state
    handleCourseChange = (e) => {
      console.log("handleCourseChange "+e.target.selectedIndex);
     let index = e.target.selectedIndex;
      this.setState({courseId: this.state.courseNames[index].value});
    };
   
   // when user has entered a new assignment name, update the state
    handleNameChange = (e) => {
      console.log("handleNameChange "+e.target.value);
      this.setState({assignmentName: e.target.value});
    };
   
   // when user has entered a new assignment due date, update the state
    handleDateChange = (e) => {
      console.log("handleDateChange "+e.target.value);
     //let longformat = new Date(e.target.value).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', });
     //console.log("longformat "+longformat)
     //let newdate = longformat.getDay()+"-"+longformat.getMonth()+"-"+longformat.getFullYear();
     //console.log("newdate "+newdate)
     //console.log("date "+longformat)
      //this.setState({dueDate: longformat.getTime()});
     this.setState({dueDate: e.target.value});
    };
   
    // when submit button pressed, send new assignment to back end 
    //  and then go to gradebook page.
    handleSubmit = ( ) => {
      console.log("NewAssignment.handleSubmit");
      const token = Cookies.get('XSRF-TOKEN');
      
      fetch(`${SERVER_URL}/addAssignment` , 
          {  
            method: 'POST', 
            headers: { 'Content-Type': 'application/json',
                       'X-XSRF-TOKEN': token }, 
            body: JSON.stringify({courseId: this.state.courseId, assignmentName: this.state.assignmentName, dueDate: this.state.dueDate})
          } )
      .then(res => {
          if (res.ok) {
            toast.success("Assignment successfully added", {
            position: toast.POSITION.BOTTOM_LEFT
            });
          } else {
            toast.error("Add Assignment failed", {
            position: toast.POSITION.BOTTOM_LEFT
            });
            console.error('Put http status =' + res.status);
      }})
        .catch(err => {
          toast.error("Add Assignment failed", {
            position: toast.POSITION.BOTTOM_LEFT
          });
          console.error(err);
        });
   };      
   
   //Add a button on the assignment list page for adding a new assignment.  Allow the instructor to enter the name, due date and the course the assignment is for.   Add a new route in App.js
   render() {
      return(
         <div className="App">
         <h4> New Assignment </h4>
         <label>Select Course</label><br />
         <select id="select_course" onChange={this.handleCourseChange}>
            {this.state.courseNames.map((e, index) => {
               return <option key={index} value={e.value}>{e.label}</option>;
            })}
         </select><br /><br />
         <form>
            <label>Assignment Name:</label><br />
            <input type="text" id="assignment_name" onChange={this.handleNameChange} required /><br /><br />
            <label>Due Date:</label><br />
            <input type="date" id="assignment_date" onChange={this.handleDateChange} required /><br /><br />
         </form>
          <Button id="Submit" name="submit_assignment" variant="outlined" color="primary" style={{margin: 10}} onClick={this.handleSubmit} >
            Submit
         </Button>
         <ToastContainer autoClose={1500} />   
         </div>
         ); 
      }; 
}

export default NewAssignment;