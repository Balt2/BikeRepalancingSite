
import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, OverlayView } from "react-google-maps"
const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
const { compose, withProps, withStateHandlers } = require("recompose");

class LocationMarker extends React.Component{

  shouldComponentUpdate(nextProps, nextState){
    console.log("SHOULD COMPONENT UPDATE?")
    console.log(nextProps)

    // this.setState({
    //   isOpen: false,
    //     location: nextProps.location,
    //     name: nextProps.name,
    //     averageRides: nextProps.averageRides,
    //     percentRides: nextProps.percentRides
    // })
    console.log(nextState)
    return true
  }
  constructor(props){
    super(props);
    //Initialize important variables for presentation
    //The props should be sent radius, score and strokeWidth values. 
    //Everthing else will be populated when the componentMounts.
    console.log(`Station Maker with props: ${props}`)
    this.state = {
        isOpen: false
    }
    this.onClickMarker = this.onClickMarker.bind(this)
    
  }
   
  onClickMarker() {


    this.setState({isOpen: !(this.state.isOpen)});
  };

  computeStrokeColor(percent){
    const p = percent*10;
    const b = 255 - 255*p*3;
    const r = 255 - 255*p;
    const g = 255 - 255*p*3;
    return `rgb(${r}, ${g}, ${b})`
  }


  
  render(){
    return(
      <div>
          <Marker
          position={this.props.location}
          icon={{ path: google.maps.SymbolPath.CIRCLE,
            strokeColor:this.computeStrokeColor(this.props.percentRides) ,
            strokeWeight: 6,
            scale: 6}}
          onClick={this.onClickMarker}
        >
          {this.state.isOpen && <InfoBox
            onCloseClick={this.onClickMarker.bind(this)}
            options={{ closeBoxURL: ``, enableEventPropagation: true }}
          >
            <div style={{ backgroundColor: `white`, opacity: 1, padding: `12px`, borderRadius: 15 }}>
              <div style={{ fontSize: `16px`, fontColor: `#08233B`, height: `125px`, width: `200px` }} >
                <h1 style={{fontSize: `10px`}} >{this.props.name}</h1>
                <table style= {{width:`100%"`}}>
                <tbody>
                    <tr>
                      <th>{`Number of ${this.props.startDemand ? 'Start' : 'End'} Rides`}</th>
                      <th>{`Percent of total ${this.props.startDemand ? 'Start' : 'End'} Rides`}</th>
                    </tr>
                    <tr>
                      <td>{this.props.averageRides}</td>
                      <td>{this.props.percentRides * 100}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </InfoBox>}
        </Marker>
      </div>
    );
  }
}

export default LocationMarker;
