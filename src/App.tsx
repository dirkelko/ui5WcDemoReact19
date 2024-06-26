import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/Table.js";
import "@ui5/webcomponents/dist/TableCell.js";
import "@ui5/webcomponents/dist/TableHeaderRow.js";
import "@ui5/webcomponents/dist/TableHeaderCell.js";
import exercises from "./exercises";
import "./App.css";
//import "../../../dirkelko/ui5-timer/src/Ui5Timer.js";
import "ui5-timer/dist/Ui5Timer.js";
import {useState} from "react";

//const exercises = async () => Workouts;

function App() {
  const [exercise, setExercise] = useState(exercises[0].name);
  const [duration, setDuration] = useState(exercises[0].duration);
  const [round, setRound] = useState(exercises[0].round);
  const [exRound, setExRound] = useState(exercises[0].ex);


  function handleRowClick(event: CustomEvent ) {
    console.log(`Row clicked: ${event.detail.row.childNodes[0].innerText} ${event.detail.row.childNodes[1].innerText}`);
    let ex = exercises.find(ex => ex.id === parseInt(event.detail.row.id));
    setExercise(ex!.name);
    setDuration(ex!.duration);
    setRound(ex!.round);
    setExRound(ex!.ex);
  };

  return (

    <div>
        <ui5-timer 
        id="myTimer"
        title={exercise}
        sub-title={"Exercise " + exRound + "/" + exercises[exercises.length-1].ex}
        sub-sub-title={"Round "+ round + "/" + exercises[exercises.length-1].round}
        duration={duration}
        vbox="0 0 1200 1200"
      />

      <ui5-table id="table1" overflowMode="Popin" onrowClick={handleRowClick}>
        <ui5-table-header-row slot="headerRow">
        <ui5-table-header-cell id="idCol" importance="3" width="50px"><span>Id</span></ui5-table-header-cell>
        <ui5-table-header-cell id="nameCol" importance="1" width="300px"><span>Name</span></ui5-table-header-cell>
        <ui5-table-header-cell id="descriptionCol" importance="3" width="300px">Description</ui5-table-header-cell>
        <ui5-table-header-cell id="roundCol" width="60px" importance="-1">Round</ui5-table-header-cell>
        <ui5-table-header-cell id="durationCol" min-width="40px" importance="2">Duration</ui5-table-header-cell>
        </ui5-table-header-row>
          {exercises.map((exercise) => (
            <ui5-table-row id={exercise.id} key={exercise.id} interactive>
              <ui5-table-cell><ui5-label><b>{exercise.id}</b></ui5-label></ui5-table-cell>
              <ui5-table-cell><ui5-label><b>{exercise.name}</b></ui5-label></ui5-table-cell>
              <ui5-table-cell><ui5-label>{exercise.description}</ui5-label></ui5-table-cell>
              <ui5-table-cell><ui5-label>{exercise.round}</ui5-label></ui5-table-cell>
              <ui5-table-cell><ui5-label><b>{exercise.duration}</b></ui5-label></ui5-table-cell>
            </ui5-table-row>
          ))} 
      </ui5-table>
    </div>

  );
}

export default App;