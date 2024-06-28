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

setTheme('sap_horizon_dark');

//test  
//const exercises = async () => Workouts;

function App() {
  const [exercise, setExercise] = useState(exercises[0]);
  const [tableIsInteractive, setTableIsInteractive] = useState(true);
  const timerRef: any = useRef(null);
  const colorOrange = {color: "orange"};


  function handleRowClick(event: CustomEvent ) {
    console.log(`Row clicked: ${event.detail.row.childNodes[0].innerText} ${event.detail.row.childNodes[1].innerText}`);
    let ex = exercises.find(ex => ex.id === parseInt(event.detail.row.getAttribute("row-id")));
    setExercise(ex!);
  };

  function handleTimerFinished(event: CustomEvent) {
    console.log(`Timer finished ${event.type}`);
    let ex = exercises.find(ex => ex.id === exercise.id+1);
    console.log(ex);
    if (ex) {
      setExercise(ex!);
      timerRef.current.resetTimer();
      timerRef.current?.startTimer();
    }
  }

  function handleTimerStart(event: CustomEvent) {
    console.log(`Timer started ${event.type}`);
    setTableIsInteractive(false);
  }

  function handleTimerStop(event: CustomEvent) {
    console.log(`Timer stopped ${event.type}`);
    setTableIsInteractive(true);  
  }

  return (

    <div>
      <ui5-timer 
        id="myTimer"
        ref={timerRef}
        title={exercise.name}
        sub-title={"Exercise " + exercise.ex + "/" + exercises[exercises.length-1].ex}
        sub-sub-title={"Round "+ exercise.round + "/" + exercises[exercises.length-1].round}
        duration={exercise.duration}
        vbox="0 0 1200 1200"
        ontimerFinished={handleTimerFinished}
        ontimerStart={handleTimerStart}
        ontimerStop={handleTimerStop}
      />

      <ui5-table id="table1" overflowMode="Popin" onrow-click={handleRowClick}> 
        <ui5-table-header-row slot="headerRow">
        <ui5-table-header-cell id="idCol" importance="3" width="50px"><span>Id</span></ui5-table-header-cell>
        <ui5-table-header-cell id="nameCol" importance="1" width="300px"><span>Name</span></ui5-table-header-cell>
        <ui5-table-header-cell id="descriptionCol" importance="3" width="300px">Description</ui5-table-header-cell>
        <ui5-table-header-cell id="roundCol" width="60px" importance="-1">Round</ui5-table-header-cell>
        <ui5-table-header-cell id="durationCol" min-width="40px" importance="2">Duration</ui5-table-header-cell>
        </ui5-table-header-row>
          {exercises.map((ex) => (
            <ui5-table-row row-id={ex.id} key={ex.id} interactive={tableIsInteractive}>
              <ui5-table-cell><ui5-label><b>{ex.id}</b></ui5-label></ui5-table-cell>
              { (exercise.id === ex.id)? 
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