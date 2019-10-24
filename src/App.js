import React, { useState, useEffect, useRef } from 'react';
import { get as JSONStoreGet, set as JSONStoreSet } from './JSONStore'
import './App.scss';
import axios from 'axios';
import RSVPNav from './components/RSVPNav'
import { getClassForSelection, getTextForSelection, isObjectEmpty } from './helpers'



function App() {




  useEffect(() => {
    var event = JSONStoreGet("event");

    
    if(!event.buttonNum){
      event.buttonNum = 0;
    }
    var accept = event.buttonNum & 1;
    var maybe = event.buttonNum & 2;
    var decline = event.buttonNum & 4;

    event.buttons = {accept:accept > 0,maybe:maybe>0,decline:decline>0 }
    setRsvpEvent(event);
    setRsvpGuest(JSONStoreGet("guest"));

    

  }
    , [])




  function updateSelectionRemote(selection) {
    axios.post("/updateregistration", { email: rsvpGuest.email, state: selection,eventid:rsvpEvent.id,name:rsvpGuest.name }).then((response) => {
      console.log(response);
    })
  }


  function changeSelection(selection) {

    var guest = { ...rsvpGuest };
    guest.state = selection;
    setRsvpGuest(guest)
    updateSelectionRemote(selection);

  }


  const [rsvpEvent, setRsvpEvent] = useState({});
  const [rsvpGuest, setRsvpGuest] = useState({ name: "Jon", email: "jon@sommplace.com", selectedDate: "Jan 1st 2019", state: 0 });
  const [selectionDisplayColor, setSelectionDisplayColor] = useState("is-info");
  const [selectionDisplayText, setSelectionDisplayText] = useState("is-info");


  useEffect(() => {
    setSelectionDisplayColor(getClassForSelection(rsvpGuest.state));
    setSelectionDisplayText(getTextForSelection(rsvpGuest.state))

  }, [rsvpGuest.state])

  function nl2br (str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function getButtonState(button){
  if(rsvpEvent.buttons){
    return  rsvpEvent.buttons[button]?"flex":"none"

  }
 
  return "none"
}

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
            <div dangerouslySetInnerHTML={{__html:nl2br(rsvpEvent.description)}} />
            </h2>


          </div>

        </div>
      </section>
      <section className="hero is-light">
        <div className="hero-body">
          <div className="container">
            <div className="columns">
              <div style={{display:getButtonState("accept")}} className="column"><button onClick={() => { changeSelection(1) }} className="button is-success is-large is-fullwidth">Accept</button></div>
              <div style={{display:getButtonState("maybe")}} className="column"><button onClick={() => { changeSelection(2) }} className="button is-warning is-large is-fullwidth">Maybe</button></div>
              <div style={{display:getButtonState("decline")}} className="column"><button onClick={() => { changeSelection(3) }} className="button is-danger is-large is-fullwidth">Decline</button></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
