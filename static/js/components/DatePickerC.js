
// require('create-react-class');
// var DatePicker = require("react-bootstrap-date-picker");

import React from "react";
//import DatePicker from "react-bootstrap-date-picker";

import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
const { compose, withProps, withStateHandlers } = require("recompose");

import LocationMarker from '../components/LocationMarker';



 
var DatePickerC = React.createClass({
  getInitialState: function(){
    var value = new Date().toISOString();
    return {
      value: value
    }
  },
  handleChange: function(value, formattedValue) {
    this.setState({
      value: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedValue: formattedValue // Formatted String, ex: "11/19/2016"
    });
  },
  componentDidUpdate: function(){
    // Access ISO String and formatted values from the DOM.
    var hiddenInputElement = document.getElementById("example-datepicker");
    console.log(hiddenInputElement.value); // ISO String, ex: "2016-11-19T12:00:00.000Z"
    console.log(hiddenInputElement.getAttribute('data-formattedvalue')) // Formatted String, ex: "11/19/2016"
  },
  render: function(){
    return <FormGroup>
      <ControlLabel>Label</ControlLabel>
      <DatePicker id="example-datepicker" value={this.state.value} onChange={this.handleChange} />
      <HelpBlock>Help</HelpBlock>
    </FormGroup>;
  }
});