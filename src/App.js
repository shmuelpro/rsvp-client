import React, { useState, useEffect, useRef } from 'react';
import { get as JSONStoreGet, set as JSONStoreSet } from './JSONStore'
import './App.scss';
import axios from 'axios';
import RSVPNav from './components/RSVPNav'
import { getClassForSelection, getTextForSelection, validateEmail } from './helpers'



function App() {


  const [rsvpEvent, setRsvpEvent] = useState({});
  const [rsvpGuest, setRsvpGuest] = useState({ state: 0 });
  const [selectionDisplayColor, setSelectionDisplayColor] = useState("is-info");
  const [selectionDisplayText, setSelectionDisplayText] = useState("is-info");
  const [guestName, setGuestName] = useState(rsvpGuest.name || "");
  const [guestEmail, setGuestEmail] = useState(rsvpGuest.email || "");
  const [errors, setErrors] = useState([]);

  const [submitButtonState, setSubmitButtonState] = useState("NOT_SUBMITTED")


  useEffect(() => {
    var event = JSONStoreGet("event");

    var buttonsNum = event.buttonsNum;

    if (!buttonsNum) {
      buttonsNum = 0;
    }
    var accept = buttonsNum & 1;
    var maybe = buttonsNum & 2;
    var decline = buttonsNum & 4;

    event.buttons = { accept: accept > 0, maybe: maybe > 0, decline: decline > 0 }

    setRsvpEvent(event);
    setRsvpGuest(JSONStoreGet("guest"));

  }, [])




  function updateSelectionRemote(data) {
    return axios.post("/updateregistration", data)
  }


  function changeSelection(selection) {

    var guest = { ...rsvpGuest };
    guest.name = guestName;
    guest.email = guestEmail;
    guest.state = selection;
    setRsvpGuest(guest)
    if (!rsvpEvent.editable) {
      updateSelectionRemote({ email: guest.email, state: guest.state, eventid: rsvpEvent.id, name: guest.name });
    }


  }



  function submitChange() {

    var cerrors = [];
    if (!rsvpGuest.state) {
      cerrors.push("Please select an option. Are you coming?");

    }
    if (!validateEmail(guestEmail)) {
      cerrors.push("Please enter a valid email address");
    }
    console.log(guestName)
    if (!guestName) {
      cerrors.push("Please enter a name");
    }
    if (cerrors.length > 0) {
      setErrors(cerrors)
      return;
    }
    setErrors([ ])
    setSubmitButtonState("SUBMITTING");
    var send = { email: guestEmail, state: rsvpGuest.state, eventid: rsvpEvent.id, name: guestName };
    console.log(send)
    updateSelectionRemote(send).then((response) => {
      console.log(response)
      setSubmitButtonState("DONE")
    }).catch((error) => {
      setSubmitButtonState("ERROR")
      console.log(error)
    })
  }




  useEffect(() => {
    setGuestName(rsvpGuest.name)
    setGuestEmail(rsvpGuest.email)
  }, [rsvpGuest])



  useEffect(() => {
    setSelectionDisplayColor(getClassForSelection(rsvpGuest.state));
    setSelectionDisplayText(getTextForSelection(rsvpGuest.state))

  }, [rsvpGuest.state])

  function nl2br(str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
      return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  }

  function getButtonState(button) {
    if (rsvpEvent.buttons) {
      return rsvpEvent.buttons[button] ? "flex" : "none"

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
              {guestName} {guestEmail} - {selectionDisplayText}
            </h2>


          </div>
        </div>
      </section>
      <section className="section">
        <div className="columns">
          <div className="column" style={{ padding: 0 }}>
            <section className="is-light">
              <div className="hero-body">
                <div className="container">
                  <div className="columns">
                    <div style={{ display: getButtonState("accept") }} className="column"><button onClick={() => { changeSelection(1) }} className="button is-success is-large is-fullwidth">Accept</button></div>
                    <div style={{ display: getButtonState("maybe") }} className="column"><button onClick={() => { changeSelection(2) }} className="button is-warning is-large is-fullwidth">Maybe</button></div>
                    <div style={{ display: getButtonState("decline") }} className="column"><button onClick={() => { changeSelection(3) }} className="button is-danger is-large is-fullwidth">Decline</button></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className="column" style={{ padding: 0, display: rsvpEvent.editable ? "block" : "none" }}>
            <section className="is-light">
              <div className="hero-body">
                <div className="container">
                  <div className="columns" style={{ alignItems: "flex-end" }}>
                    <div className="column"> Name: <input className="input" value={guestName} onChange={(e) => { setGuestName(e.target.value) }} type="text" placeholder="Full Name" /></div>
                    <div className="column"> Email: <input className="input" value={guestEmail} onChange={(e) => { setGuestEmail(e.target.value) }} type="text" placeholder="Email Address" /></div>
                    <div className="column">
                      {submitButtonState === "NOT_SUBMITTED" && <button onClick={() => { submitChange() }} className="button has-background-link has-text-white is-fullwidth">Submit</button>}
                      {submitButtonState === "SUBMITTING" && <button className="button has-background-primary has-text-white is-fullwidth">Submitting...</button>}
                      {submitButtonState === "DONE" && <button className="button has-background-info has-text-white is-fullwidth">Done!</button>}
                      {submitButtonState === "ERROR" && <button className="button has-background-danger has-text-white is-fullwidth">Error</button>}

                    </div>

                  </div>
                  <div className="columns" >
                    <div className="column">
                      {errors.map((e,i)=>{
                        return <div key={i}>{e}</div>
                      })}
                    </div>
                  </div>
                </div>
              </div>

            </section>
          </div>
        </div>
      </section>
      <section className="section has-background-white-ter">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              {rsvpEvent.name}
            </h1>
            <h2 className="subtitle">
              {rsvpEvent.date}
            </h2>
            <h2 className="subtitle">
              <div dangerouslySetInnerHTML={{ __html: nl2br(rsvpEvent.description) }} />
            </h2>


          </div>

        </div>
      </section>
      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            <strong>SIGNAL RSVP</strong> <small>{rsvpEvent.name}</small> - <small>{rsvpEvent.date}</small>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
