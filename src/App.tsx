import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/Table.js";
import "@ui5/webcomponents/dist/TableCell.js";
import "@ui5/webcomponents/dist/TableHeaderRow.js";
import "@ui5/webcomponents/dist/TableHeaderCell.js";
import exercises from "./exercises";
import "./App.css";
//import "../../ui5wc-timer/src/UI5Timer.js";
import "ui5-timer/dist/Ui5Timer.js";
import {useState} from "react";

//const exercises = async () => Workouts;

function App() {
  const [exercise, setExercise] = useState(exercises[0].name);
  const [duration, setDuration] = useState(exercises[0].duration);

  function handleRowClick(event: CustomEvent ) {
    console.log(`Row clicked: ${event.detail.row.childNodes[0].innerText} ${event.detail.row.childNodes[1].innerText}`);
    setExercise(event.detail.row.childNodes[1].innerText);
    setDuration(parseInt(event.detail.row.childNodes[4].innerText));
  }

  return (
    <div>
        <ui5-timer 
        id="myTimer"
        exercise={exercise}
        exercise-info="DUMDIDELDUM"
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
            <ui5-table-row key={exercise.id} interactive>
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