import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/Table.js";
import "@ui5/webcomponents/dist/TableCell.js";
import "@ui5/webcomponents/dist/TableHeaderRow.js";
import "@ui5/webcomponents/dist/TableHeaderCell.js";
import exercises from "./exercises";
import "./App.css";
import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme.js';
//import "../../../dirkelko/ui5-timer/src/Ui5Timer.js";
import "ui5-timer/dist/Ui5Timer.js";
import {useState, useRef} from "react";
import UI5Timer from "ui5-timer/dist/Ui5Timer.js";

setTheme('sap_horizon_dark');

//test  
//const exercises = async () => Workouts;

function App() {
  const [exerciseId, setExerciseId] = useState(exercises[0].id);
  const [exercise, setExercise] = useState(exercises[0].name);
  const [duration, setDuration] = useState(exercises[0].duration);
  const [round, setRound] = useState(exercises[0].round);
  const [exRound, setExRound] = useState(exercises[0].ex);
  const timerRef: any = useRef(null);
  const colorOrange = {color: "orange"};


  function handleRowClick(event: CustomEvent ) {
    console.log(`Row clicked: ${event.detail.row.childNodes[0].innerText} ${event.detail.row.childNodes[1].innerText}`);
    let ex = exercises.find(ex => ex.id === parseInt(event.detail.row.id));
    setExerciseId(ex!.id);
    setExercise(ex!.name);
    setDuration(ex!.duration);
    setRound(ex!.round);
    setExRound(ex!.ex);
  };

  function handleTimerFinished(event: CustomEvent) {
    console.log(`Timer finished`);
    let ex = exercises.find(ex => ex.id === exerciseId+1);
    console.log(ex);
    if (ex) {
      setExerciseId(ex.id);
      setExercise(ex.name);
      setDuration(ex.duration);
      setRound(ex.round);
      setExRound(ex.ex);
      timerRef.current.resetTimer();
      timerRef.current?.startTimer();
    }
  }

  return (

    <div>
        <ui5-timer 
        id="myTimer"
        ref={timerRef}
        title={exercise}
        sub-title={"Exercise " + exRound + "/" + exercises[exercises.length-1].ex}
        sub-sub-title={"Round "+ round + "/" + exercises[exercises.length-1].round}
        duration={duration}
        vbox="0 0 1200 1200"
        ontimerFinished={handleTimerFinished}
      />

      <ui5-table id="table1" overflowMode="Popin" onrowClick={handleRowClick}>
        <ui5-table-header-row slot="headerRow">
        <ui5-table-header-cell id="idCol" importance="3" width="50px"><span>Id</span></ui5-table-header-cell>
        <ui5-table-header-cell id="nameCol" importance="1" width="300px"><span>Name</span></ui5-table-header-cell>
        <ui5-table-header-cell id="descriptionCol" importance="3" width="300px">Description</ui5-table-header-cell>
        <ui5-table-header-cell id="roundCol" width="60px" importance="-1">Round</ui5-table-header-cell>
        <ui5-table-header-cell id="durationCol" min-width="40px" importance="2">Duration</ui5-table-header-cell>
        </ui5-table-header-row>
          {exercises.map((ex) => (
            <ui5-table-row id={ex.id} key={ex.id} interactive>
              <ui5-table-cell><ui5-label><b>{ex.id}</b></ui5-label></ui5-table-cell>
              { (exerciseId === ex.id)? 
                <ui5-table-cell><ui5-label><b style={colorOrange}>{ex.name}</b></ui5-label></ui5-table-cell>:
                <ui5-table-cell><ui5-label><b>{ex.name}</b></ui5-label></ui5-table-cell>
              }
              <ui5-table-cell><ui5-label>{ex.description}</ui5-label></ui5-table-cell>
              <ui5-table-cell><ui5-label>{ex.round}</ui5-label></ui5-table-cell>
              <ui5-table-cell><ui5-label><b>{ex.duration}</b></ui5-label></ui5-table-cell>
            </ui5-table-row>
          ))} 
      </ui5-table>
    </div>

  );
}

export default App;