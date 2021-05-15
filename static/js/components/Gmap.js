
import React from "react";
import ReactDOM from 'react-dom';

import { withScriptjs, withGoogleMap, GoogleMap, Marker, OverlayView, GoogleApiWrapper } from "react-google-maps"
const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
const { compose, withProps, withStateHandlers } = require("recompose");

import LocationMarker from '../components/LocationMarker';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';

import Legend from './Legend';

//const google = window.google; // yeah, I know...


class Gmap extends React.Component{
  
  constructor(props){
    super(props)
    const dataDict = JSON.parse(props.data)
    console.log(props.data)
    const totalInfo = this.getNumberOfRidesHalfHour(dataDict['data'], dataDict['dataType'], dataDict['halfHour'] )
    this.state = {
      halfHour: parseInt(dataDict['halfHour']),
      dataType: dataDict['dataType'],
      stationData: dataDict['data'],
      startDemand: dataDict['startDemand'],
      ridesThisHalfHour: totalInfo[1],
      percentOfRidesToday: totalInfo[1]/totalInfo[0]
    }
    
    this.dataTypeSubmit = this.dataTypeSubmit.bind(this)
    this.changeHalfHour = this.changeHalfHour.bind(this)
    this.monthsSelected = this.monthsSelected.bind(this)
    this.submitMonths = this.submitMonths.bind(this)
    this.toggleStartEnd = this.toggleStartEnd.bind(this)
    this.getNumberOfRidesHalfHour = this.getNumberOfRidesHalfHour.bind(this)
  }

  componentDidMount(){
    console.log("MOUNTING")
  }




  changeHalfHour(event){
    console.log("Changing Half Hour!")
    var newHalfHour = document.getElementById("timeSelector").value;
    const totalInfo = this.getNumberOfRidesHalfHour(this.state.stationData, this.state.dataType, newHalfHour )
    this.setState({halfHour: newHalfHour, ridesThisHalfHour: totalInfo[1], percentOfRidesToday: totalInfo[1]/totalInfo[0] })
  }

  dataTypeSubmit(event){
    var selectedDataType = document.getElementById("chooseDataType").value;
    const totalInfo = this.getNumberOfRidesHalfHour(this.state.stationData, selectedDataType, this.state.halfHour)
    console.log(`Selected Data Type: ${selectedDataType}`)
    this.setState({dataType: selectedDataType, ridesThisHalfHour: totalInfo[1], percentOfRidesToday: totalInfo[1]/totalInfo[0] })
  }

  monthsSelected(value){
    this.setState({selectedValues: value})
  }

  submitMonths(e){
    if (typeof(this.state.selectedValues) != "undefined"){  
      const jsonRequest = {"selectedValues": this.state.selectedValues, "halfHour": this.state.halfHour, "dataType": this.state.dataType, "startDemand": this.state.startDemand}
      console.log(jsonRequest)
      fetch("/result", {
        method:"POST",
        cache: "no-cache",
        headers:{
            "content_type":"application/json",
        },
        body: JSON.stringify(jsonRequest)
        }).then(response => {
          return response.json()
        })
        .then(json => {
          const totalInfo = this.getNumberOfRidesHalfHour(json['data'], json['dataType'], json['halfHour'])
          this.setState({stationData: json['data'], dataType: json['dataType'], 
          halfHour: parseInt(json['halfHour']), 
          percentOfRidesToday: totalInfo[1]/totalInfo[0],
          ridesThisHalfHour: totalInfo[1]
        })       
          console.log("HI. We recievd a response from the backend. We recieved you!")
        })
      }
    }

    toggleStartEnd(val){
      if (typeof(this.state.selectedValues) != "undefined"){  
        console.log(val)
        var newStartDemand = !this.state.startDemand

        const jsonRequest = {"selectedValues": this.state.selectedValues, "halfHour": this.state.halfHour, "dataType": this.state.dataType, "startDemand": newStartDemand}
        console.log(jsonRequest)
        fetch("/result", {
          method:"POST",
          cache: "no-cache",
          headers:{
              "content_type":"application/json",
          },
          body: JSON.stringify(jsonRequest)
          }).then(response => {
            return response.json()
          })
          .then(json => {
            const totalInfo = this.getNumberOfRidesHalfHour(json['data'], json['dataType'], json['halfHour'])
            this.setState({stationData: json['data'], dataType: json['dataType'], 
            halfHour: parseInt(json['halfHour']), 
            startDemand: newStartDemand,
            percentOfRidesToday: totalInfo[1]/totalInfo[0],
            ridesThisHalfHour: totalInfo[1]
          })       
            console.log("HI. We recievd a response from the backend. We recieved you!")
          })
      }
    }

  getNumberOfRidesHalfHour(stationData, dType, halfHour){

    var i;
    var j;
    var sum = 0;
    var thisHalfHour = 0;

    for(var stationKey in stationData['stations']){
      if (dType != "weekend" && dType != "weekday"){

        for (var key in stationData['stations'][stationKey]['daysOfWeekRides'][dType]) {
          const rides = stationData['stations'][stationKey]['daysOfWeekRides'][dType][key][0];
          sum = rides + sum
          if (key == halfHour){
            thisHalfHour = thisHalfHour + rides
          }
        }
      }else{
        for (var key in stationData['stations'][stationKey][`${dType}Rides`]) {
          const rides = stationData['stations'][stationKey][`${dType}Rides`][key][0];
          sum = rides + sum
          if (key == halfHour){
            thisHalfHour = thisHalfHour + rides
          }
        }
      }
    }
    return [sum, thisHalfHour]

  }



  formatTime(num){

    var hour = Math.floor(num/2)
    if (hour == 0){
      hour = 12
    }
    var min = ((num % 2 )*30).toString()
    if (min == "0"){
      min = "00"
    } 

    if (num < 24){
      return `${hour}:${min} AM`
    }else if(num < 26){
      return `${hour}:${min} PM` //12:00 and 12:30
    }else{
      return `${hour - 12}:${min} PM`
    }

  }

  
  
    testStatePrint(data){
      console.log("TESTING")
      console.log(data)
    }

  render(){
    console.log(`Re-Rendering with state: ${this.state}`)


    
    const options = [
      { label: 'January 2019', value: "201901"},
      { label: 'Febuary 2019', value: "201902"},
      { label: 'March 2019 ', value: "201903"},
      {label: 'April 2019 ', value: "201904"},
      {label: 'May 2019 ', value: "201905"},
      {label: 'June 2019 ', value: "201906"},
      {label: 'July 2019 ', value: "201907"},
      {label: 'August 2019 ', value: "201908"},
      {label: 'September 2019 ', value: "201909"},
      {label: 'October 2019 ', value: "201910"},
      {label: 'November 2019 ', value: "201911"},
      {label: 'December 2019 ', value: "201912"},
      { label: 'January 2020', value: "202001"},
      { label: 'Febuary 2020', value: "202002"},
      { label: 'March 2020 ', value: "202003"},
      {label: 'April 2020 ', value: "202004"},
      {label: 'May 2020 ', value: "202005"},
      {label: 'June 2020 ', value: "202006"},
      {label: 'July 2020 ', value: "202007"},
      {label: 'August 2020 ', value: "202008"},
      {label: 'September 2020 ', value: "202009"},
      {label: 'October 2020 ', value: "202010"},
      {label: 'November 2020 ', value: "202011"},
      {label: 'December 2020 ', value: "202012"}
    ];
    

    return(
      
        <div className="map">
          <form>
          <Container>
          <Row>
            <Col>
              <label className="mr-sm-2" htmlFor="inlineFormCustomSelect">Choose type of day</label>
              <select className="custom-select mr-sm-2" id="chooseDataType" onChange={this.dataTypeSubmit}>
                <option value="weekday">Weekday</option>
                <option value="weekend">Weekend</option>
                <option value="0">Monday</option>
                <option value="1">Tuesday</option>
                <option value="2">Wednesday</option>
                <option value="3">Thursday</option>
                <option value="4">Friday</option>
                <option value="5">Saturday</option>
                <option value="6">Sunday</option>
              </select>
            </Col>

            <Col style={{textAlign: 'center', margin: 'auto'}} >
              <h6 className="mr-sm-2">{`Time: ${this.formatTime(this.state.halfHour)}`}</h6>
              <input type="range" class="form-range" min="0" max="47" defaultValue={this.state.halfHour} onChange={this.changeHalfHour} id="timeSelector"/>
            </Col>
            <Col style={{textAlign: 'center', marginTop: '30px'}} >
              <Row>
                <ReactMultiSelectCheckboxes style={{width: '200px'}} options={options} onChange={this.monthsSelected} />
                <button class="btn btn-primary" type="button" style={{marginLeft: '20'}} onClick={this.submitMonths}>Submit Months!</button>
                
              </Row>
            </Col>

            </Row>
            </Container>
            
            
        </form>

        <Container style={{alignItems: 'center', display: 'flex'}}>
          <button class = "btn btn-primary" type="button" onClick={this.toggleStartEnd} style={{width: '180', height: '40', textAlign: 'center', margin: 'auto'}}>{`See ${this.state.startDemand ? 'End' : 'Start'} Demand`}</button>
        </Container>

        <Container fluid>
          <Row>
          <Col xs={14} md={10}>
            <MapComponent isMarkerShown = {true} 
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places" 
          
            onToggleOpen={this.onToggleOpen}
            isOpen = {false}
            stationData = {this.state.stationData}
            dataType = {this.state.dataType}
            halfHour = {this.state.halfHour}
            ridesThisHalfHour = {this.state.ridesThisHalfHour}
            percentOfRides = {this.state.percentOfRidesToday }
            computeStrokeColor = {this.computeStrokeColor}
            startDemand = {this.state.startDemand}
            />
            </Col>
            <Col>
              <Legend ridesThisHalfHour = {this.state.ridesThisHalfHour} percentOfRides = {this.state.percentOfRidesToday } startDemand = {this.state.startDemand}  />
            </Col>
          </Row>
        </Container>
      </div>
        
    )
  }
}




export default Gmap;


//https://tomchentw.github.io/react-google-maps/
const MapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px`, padding: 20 }} />,
    mapElement: <div style={{ height: `100%` }} />,
    center: { lat: 40.785091, lng: -73.968285  },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <div className = "wrapper" style={{position: 'relative'}}>
    <div className = "map">
      <GoogleMap
        defaultZoom={13}
        defaultCenter={props.center}
      >

    {

        props.stationData['stations'].map((station, index) => (
          <LocationMarker key = {index} 
          location = {{lat: station['lat'], lng: station['lng']}}
          name={station['name']}

          averageRides = {(props.dataType != "weekend" && props.dataType != "weekday") 
          ? station['daysOfWeekRides'][`${props.dataType}`][`${props.halfHour}`][0].toFixed(2) 
          : station[`${props.dataType}Rides`][`${props.halfHour}`][0].toFixed(2) }

          percentRides = {(props.dataType != "weekend" && props.dataType != "weekday") 
          ? station['daysOfWeekRides'][`${props.dataType}`][`${props.halfHour}`][1].toFixed(2) 
          : station[`${props.dataType}Rides`][`${props.halfHour}`][1].toFixed(2) }

          computeStrokeColor = {props.computeStrokeColor}

          startDemand = {props.startDemand}

          />
        ))
      }
      
        
      </GoogleMap>
    </div>
   
  </div>
);

// export default GoogleApiWrapper({
//   apiKey: 'AIzaSyAkLc7jQ8x1FqvQImwWfahgsTd8NK1kD_I'
// })(MapComponent);

