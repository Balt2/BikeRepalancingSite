import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge'

const Legend = props => {
//     props = {
   // ridesThisHalfHour,
   //percentOfRides
   //
//    }
    function computeStrokeColor(percent){
        const p = percent*10;
        const b = 255 - 255*p*3;
        const r = 255 - 255*p;
        const g = 255 - 255*p*3;
        return `rgb(${r}, ${g}, ${b})`
    }

    return (
        <div className="z-depth-5" style={{backgroundColor: 'black', 
        borderRadius: `5px`, 
            borderColor: 'black', 
            marginRight: '10px',

        }}>
        <Modal.Dialog>
            <Modal.Header>
                <Modal.Title>Info</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>{`Rides ${props.startDemand ? 'Starting' : 'Ending'} this Half Hour:`} <b>{(props.ridesThisHalfHour).toFixed(2) }</b> </p>
                <p>{`Percent of Rides ${props.startDemand ? 'Starting' : 'Ending'} Today:`} <b>{(props.percentOfRides * 100).toFixed(2) }%</b> </p>
                <h6>Legend:</h6>
                <Badge pill style={{backgroundColor: computeStrokeColor(.01), color: 'white'}}>
                    {`> 1%`}
                </Badge>{' '}
                <Badge pill style={{backgroundColor: computeStrokeColor(.02), marginTop: `10px`, color: 'white'}}>
                    {`> 2%`}
                </Badge>{' '}
                <Badge pill style={{backgroundColor: computeStrokeColor(.03), marginTop: `10px`, color: 'white'}}>
                    {`> 3%`}
                </Badge>{' '}
                <Badge pill style={{backgroundColor: computeStrokeColor(.04), marginTop: `10px`, color: 'white'}}>
                    {`> 4%`}
                </Badge>{' '}
                <Badge pill style={{backgroundColor: computeStrokeColor(.05), marginTop: `10px`, color: 'white'}}>
                    {`> 5%`}
                </Badge>{' '}
                <Badge pill style={{backgroundColor: computeStrokeColor(.06), marginTop: `10px`, color: 'white'}}>
                    {`> 6%`}
                </Badge>{' '}
                <Badge pill style={{backgroundColor: computeStrokeColor(.07), marginTop: `10px`, color: 'white'}}>
                    {`> 7%`}
                </Badge>{' '}
                <Badge pill style={{backgroundColor: computeStrokeColor(.08), marginTop: `10px`, color: 'white'}}>
                    {`> 8%`}
                </Badge>{' '}
            </Modal.Body>

            <Modal.Footer>
                
            </Modal.Footer>
        </Modal.Dialog>
        </div>
    );
}

export default Legend;