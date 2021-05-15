import React from "react";
import ReactDOM from "react-dom";
import Gmap from './components/Gmap'

// function myFunc() {
//     return username + site
// }

function myFunc(){
    
    var data = document.getElementById("sender").getAttribute("heading");
    return data;
}




ReactDOM.render(
    <div>
        <h1 style={{textAlign: 'center', paddingTop: '15px'}}>Joco Trip Demand with Citi Bike Data</h1>
        <Gmap data= {myFunc()} />
    </div>, document.getElementById("content")
);

