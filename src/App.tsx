import "@ui5/webcomponents/dist/Text.js";
import "@ui5/webcomponents/dist/Table.js";
import "@ui5/webcomponents/dist/TableCell.js";
import "@ui5/webcomponents/dist/TableHeaderRow.js";
import "@ui5/webcomponents/dist/TableHeaderCell.js";
import "@ui5/webcomponents/dist/Dialog.js";
import "@ui5/webcomponents/dist/TabContainer.js";
import "@ui5/webcomponents/dist/Tab.js";
import "@ui5/webcomponents/dist/MessageStrip.js";
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents-icons/dist/AllIcons.js"

import exercises from "./exercises";
import "./App.css";
import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme.js';
//import "../../../dirkelko/ui5-timer/dist/Ui5Timer.js";
import "ui5-timer/dist/Ui5Timer.js";
import {useState, useRef} from "react";

import "@repo/webcomponents-p13n/dist/SelectionPanel.js";

setTheme('sap_horizon_dark');

const persistedP13nData = localStorage.getItem("p13nData") && JSON.parse(localStorage.getItem("p13nData"));

const initialP13nData = persistedP13nData || [
  { visible: true, name: "Id", label: "Id", id:"id", importance:"3", width:"50px" },
  { visible: true, name: "Name", label: "Name", id:"name", importance:"1", width:"300px" },
  { visible: true, name: "Desription", label: "Description", id:"description", importance:"3", width:"300px" },
  { visible: true, name: "Round", label: "Round", id:"round", importance:"-1", width:"60px" },
  { visible: true, name: "Duration", label: "Duration", id:"duration", importance:"2", width:"70px" }
];

function App() {
  const [exercise, setExercise] = useState(exercises[0]);
  const [tableIsInteractive, setTableIsInteractive] = useState(true);
  const [p13nOpen, setP13nOpen] = useState(false);
  const [p13nData, setP13nData] = useState(initialP13nData);
  const timerRef: any = useRef(null);

  let textColor: string;

  function handleRowClick(event: CustomEvent ) {
    console.log(`Row clicked: ${event.detail.row.childNodes[0].innerText} ${event.detail.row.childNodes[1].innerText}`);
    let ex = exercises.find(ex => ex.id === parseInt(event.detail.row.getAttribute("row-key")));
    setExercise(ex!);
    timerRef.current.resetTimer();
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

  function handleP13NDialog(event: CustomEvent) {
    console.log(`Handle P13N Dialog ${event.type}`);
    const p13nPanel = document.getElementById("selectionPanel");

    setP13nData(p13nPanel.p13nData);
    localStorage.setItem("p13nData", JSON.stringify(p13nPanel.p13nData));
    setP13nOpen(false);

  }

  function handleP13nDialogOpener(event: CustomEvent) {
    console.log(`Handle Dialog Opener ${event.type}`);
    const p13nPanel = document.getElementById("selectionPanel");

		p13nPanel.p13nData = p13nData;
    setP13nOpen(true);  
  
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


      <ui5-dialog id="dialog" style={{height:'55rem', width:'45rem'}} header-text="View Settings" open={p13nOpen}>

      <ui5-tabcontainer fixed collapsed>
        <ui5-tab text="Columns" selected></ui5-tab>
        <ui5-tab text="Sort"></ui5-tab>
        <ui5-tab text="Group"></ui5-tab>
      </ui5-tabcontainer>

      <div slot="footer" style={{display: "flex", justifyContent: 'flex-end',width: '100%', alignItems: 'center'}}>
        <div style={{flex: 1}}></div>
        <ui5-button class="dialogCloser" design="Emphasized" style={{marginRight: '0.5rem'}} onClick={handleP13NDialog}>OK</ui5-button>
        <ui5-button class="dialogCloser" design="Transparent" onClick={()=>setP13nOpen(false)}>Cancel</ui5-button>
      </div>

      <ui5-selection-panel
        id="selectionPanel"
        enable-count
        enable-reorder
        show-header
        field-column="A Column"
        active-column="Another one"
        style={{width:'100%'}}
      >
        <ui5-message-strip design="Positive" hide-close-button slot="messageStrip">Success Message</ui5-message-strip>
      </ui5-selection-panel>

      </ui5-dialog>



      <ui5-bar id="tableToolbar" design="Header" accessible-name-ref="title" style={{top: 0, zIndex: 2, height: '50px'}}>
			<ui5-title tabindsex="0" level="H3" id="title" slot="startContent">Exercises</ui5-title>
      <ui5-button id="dialogOpener" icon="action-settings" slot="endContent" onClick={handleP13nDialogOpener}></ui5-button>
		  </ui5-bar>
      <ui5-table id="exercisesTable" overflowMode="Popin" onrow-click={handleRowClick}> 
        <ui5-table-header-row slot="headerRow">
          {p13nData.filter(col=>col.visible).map((col) => (
            <ui5-table-header-cell id={col.id} importance={col.importance} width={col.width}><span>{col.label}</span></ui5-table-header-cell>
          ))}

        </ui5-table-header-row>
          {exercises.map((ex) => (
            <ui5-table-row row-key={ex.id} key={ex.id} interactive={tableIsInteractive}>
               {textColor = (exercise.id === ex.id)? "var(--sapCriticalElementColor)" : "var(--sapTextColor)"}
               {p13nData.filter(col=>col.visible).map((col) => (
                  <ui5-table-cell><ui5-text><b style={{color: textColor}}>{ex[col.id]}</b></ui5-text></ui5-table-cell>
              ))}
            </ui5-table-row>
          ))} 
      </ui5-table>
    </div>

  );
}

export default App;