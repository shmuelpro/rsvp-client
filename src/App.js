import React, { useState,useEffect } from 'react';

import './App.scss';
import RSVPNav from './components/RSVPNav'


function App() {

  function getClassForSelection(selection) {
    switch (selection) {
      case 0:
        return "is-info";
      case 1:
        return "is-success"
      case 2:
        return "is-warning";
      case 3:
        return "is-danger";
      default:
        return "is-info"
    }
  }

  


  function getTextForSelection(selection){
    switch (selection) {
      case 0:
        return "Nothing selected. Please select an option";
      case 1:
        return "You've Accepted our invitation. See you there!"
      case 2:
        return "You've Selected Maybe. Thank you(?)";
      case 3:
          return "You've Selected Decline. We are sorry you won't be joining";
      default:
          return "Nothing selected. Please select an option";
    }
  }
function changeSelection(selection){

  var guest = {...rsvpGuest};
  guest.selectedOption = selection;
  setRsvpGuest(guest)

}


  const [rsvpEvent, setRsvpEvent] = useState({ name: "Meeting in China", description: "Just come and have fun", date: "Jan 1st 2019", image: "/dev/null" });
  const [rsvpGuest, setRsvpGuest] = useState({ name: "Jon", email: "jon@sommplace.com", selectedDate: "Jan 1st 2019", selectedOption: 0 });
  const [selectionDisplayColor,setSelectionDisplayColor] = useState("is-info");
  const [selectionDisplayText,setSelectionDisplayText] = useState("is-info");

  
  useEffect(()=>{
    setSelectionDisplayColor(getClassForSelection(rsvpGuest.selectedOption));
    setSelectionDisplayText(getTextForSelection(rsvpGuest.selectedOption))

  },[rsvpGuest.selectedOption])
  return (
    <div className="App">
      <RSVPNav />
      <section className={`hero ${selectionDisplayColor}`}>
        <div className="hero-body">
          <div className="container">
          <h2 className="subtitle">
              {rsvpGuest.name} {rsvpGuest.email} - {selectionDisplayText}
            </h2>
          
            <h1 className="title">
              {rsvpEvent.name}
            </h1>
            <h2 className="subtitle">
              {rsvpEvent.date}
            </h2>
            <h2 className="subtitle">
              {rsvpEvent.description}
            </h2>
       

          </div>

        </div>
      </section>
      <section class="hero is-light">
        <div class="hero-body">
          <div class="container">
            <div className="columns">
              <div className="column"><button onClick={()=>{changeSelection(1)}} className="button is-success is-large is-fullwidth">Accept</button></div>
              <div className="column"><button onClick={()=>{changeSelection(2)}} className="button is-warning is-large is-fullwidth">Maybe</button></div>
              <div className="column"><button onClick={()=>{changeSelection(3)}} className="button is-danger is-large is-fullwidth">Decline</button></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
