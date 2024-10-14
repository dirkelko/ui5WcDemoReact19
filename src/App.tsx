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
import "@ui5/webcomponents-icons/dist/expand-group.js"
import "@ui5/webcomponents-icons/dist/collapse-group.js"
import "@ui5/webcomponents-icons/dist/AllIcons.js"

import exercises from "./exercises";
import "./App.css";
//import "../../../dirkelko/ui5-timer/dist/Ui5Timer.js";
import "ui5-timer/dist/Ui5Timer.js";
import {useState, useRef, SyntheticEvent} from "react";

import "@repo/webcomponents-p13n/dist/SelectionPanel.js";
import "@repo/webcomponents-p13n/dist/P13nItem.js";
import "@repo/webcomponents-p13n/dist/GroupPanel.js";
import "@repo/webcomponents-p13n/dist/P13nPopup.js";
import "@repo/webcomponents-p13n/dist/P13nGroupItem.js";
import "@repo/webcomponents-p13n/dist/SortPanel.js";
import "@repo/webcomponents-p13n/dist/P13nSortItem.js";
import "@repo/webcomponents-p13n/dist/FilterPanel.js";
import "@repo/webcomponents-p13n/dist/P13nFilterItem.js";

//import "@ui5/webcomponents/dist/Assets.js";
//import "@ui5/webcomponents-fiori/dist/Assets.js";
//import "@ui5/webcomponents-icons/dist/Assets.js";
//import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";

//setTheme('sap_horizon_dark');

const persistedP13nData = localStorage.getItem("p13nData") && JSON.parse(localStorage.getItem("p13nData")!);

type p13nType = {name: string, label: string, visible: boolean, descending: boolean, ascending: boolean, grouped: boolean, filter: any}

let intP13nData = persistedP13nData || [
  { name: "id",           label: "Id",          visible: true, descending: false, ascending: false, grouped: false, filter: undefined},
  { name: "name",         label: "Name",        visible: true, descending: false, ascending: false, grouped: false, filter: undefined},
  { name: "description",  label: "Description", visible: true, descending: false, ascending: false, grouped: false, filter: undefined},
  { name: "round",        label: "Round",       visible: true, descending: false, ascending: false, grouped: false, filter: undefined},
  { name: "duration",     label: "Duration",    visible: true, descending: false, ascending: false, grouped: false, filter: undefined}
];

function App() {
  const [exercise, setExercise] = useState(exercises[0]);
  const [tableIsInteractive, setTableIsInteractive] = useState(true);
  const [p13nOpen, setP13nOpen] = useState(false);
  const [p13nData, setP13nData] = useState(intP13nData);
  const [p13nSortData, setP13nSortData] = useState(JSON.parse(JSON.stringify(intP13nData)));
  const [tableData, setTableData] = useState(JSON.parse(JSON.stringify(intP13nData)));
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

  function handleP13nDialogOpener(event: CustomEvent) {
    console.log(`Handle Dialog Opener ${event.type}`);
    setP13nOpen(true);  
  
  }  
  
  function handleP13nChangeSelection({nativeEvent}: SyntheticEvent<HTMLElement,CustomEvent>) {
    console.log(`Handle Dialog Change ${nativeEvent.detail.reason}`);
    const change = nativeEvent.detail
    if (change.reason === "Remove") {
      intP13nData.find((col:p13nType)=> col.name === change.item[0].name).visible = false;
    } else if (change.reason === "Add") {
      intP13nData.find((col:p13nType)=> col.name === change.item[0].name).visible = true;
    } else if (change.reason === "RangeSelect") {
      change.item.forEach((item:p13nType)=> {
        intP13nData.find((col:p13nType) => col.name === item.name).visible = true;
      })
    }else if (change.reason === "DeselectAll") {
      change.item.forEach((item:p13nType)=> {
        intP13nData.find((col:p13nType) => col.name === item.name).visible = false;
      })
    }else if (change.reason === "SelectAll") {
      change.item.forEach((item:p13nType)=> {
        intP13nData.find((col:p13nType) => col.name === item.name).visible = true;
      })
    }else if (change.reason === "Move") {
      const currentIndex = intP13nData.findIndex((col:p13nType) => col.name === change.item[0].name);
      if (currentIndex !== -1) {
        const [movedItem] = intP13nData.splice(currentIndex, 1); // Remove the item from its current position
        intP13nData.splice(change.index, 0, movedItem); // Insert the item at the new position
      }
    }
    //let newP13nData = JSON.parse(JSON.stringify(intP13nData)); // Create a copy of the original array so that react sees that the order has been changed
    setP13nData(JSON.parse(JSON.stringify(intP13nData)))
  }

  function handleP13nChangeFilter({nativeEvent}: SyntheticEvent<HTMLElement,CustomEvent>) {
    console.log(`Handle Change Filter ${nativeEvent.detail.reason}`);
    const change = nativeEvent.detail
    if (change.reason === "Filter"){
      change.item.forEach((item:p13nType)=> {
        intP13nData.find((col:p13nType) => col.name === item.name).filter = item.filter
      } )
      setP13nData(JSON.parse(JSON.stringify(intP13nData)))

    }
  }

  function handleP13nChangeSorting({nativeEvent}: SyntheticEvent<HTMLElement,CustomEvent>) {
    console.log(`Handle Change Sorting ${nativeEvent.detail.reason}`);
    nativeEvent.detail.item.forEach((item: p13nType)=>{
      p13nSortData.find((col:p13nType) => col.name === item.name).ascending = item.ascending;
      p13nSortData.find((col:p13nType) => col.name === item.name).descending = item.descending;      
      p13nSortData.push(p13nSortData.splice(p13nSortData.indexOf(p13nSortData.find((col:p13nType) => col.name === item.name)), 1)[0]);
    })
    setP13nSortData(JSON.parse(JSON.stringify(p13nSortData)))
  }

  function handleP13nChangeGrouping({nativeEvent}: SyntheticEvent<HTMLElement,CustomEvent>) {
    console.log(`Handle Change Grouping ${nativeEvent.detail.reason}`);
    const change = nativeEvent.detail
    if (change.reason === "Group") {
       intP13nData.find((col:p13nType)=> col.name === change.item[0].name).grouped = change.item[0].grouped;
    } else if (change.reason === "Replace") {
        change.item.forEach((item:p13nType)=> {
          intP13nData.find((col:p13nType) => col.name === item.name).grouped = item.grouped;
        })
    } 
    setP13nData(JSON.parse(JSON.stringify(p13nSortData)))
  }

  function handleClose(event: CustomEvent){
    console.log(`Handle Close ${event.type}`);
    setP13nOpen(false);  
    if (event.detail.reason == "Submit"){
      setTableData(JSON.parse(JSON.stringify(intP13nData)))
      localStorage.setItem("p13nData", JSON.stringify(p13nData));
      //exercises.sort(tableRowSorter(p13nSortData))
    }
  }

// Comparator function to sort by several parameters
const tableRowSorter = (p13nSorters: p13nType[]) => (a: any,b: any) =>{
  let returnValue = 0;

  p13nSorters.filter((sorter: p13nType)=>sorter.ascending || sorter.descending).every((sorter: p13nType)=>{
      if (a[sorter.name] > b[sorter.name]) {
        returnValue = (sorter.ascending)? 1 : -1 ;
        return false;
      } 
      else if (a[sorter.name] < b[sorter.name]){
        returnValue = (sorter.ascending)? -1 : 1 ;
        return false;
      } 
      else {
        returnValue = 0;
        return true;
      }
  })
  //console.log(`A ${a.id} B ${b.id} : ${returnValue}` )
  return returnValue;
}  

  return (
    <div>
      <ui5-timer
        style={{visibility: "hidden"}}
        id="myTimer"
        ref={timerRef}
        title={exercise.name}
        sub-title={
          "Exercise " + exercise.ex + "/" + exercises[exercises.length - 1].ex
        }
        sub-sub-title={
          "Round " +
          exercise.round +
          "/" +
          exercises[exercises.length - 1].round
        }
        duration={exercise.duration}
        vbox="0 0 1200 1200"
        ontimer-finished={handleTimerFinished}
        ontimer-start={handleTimerStart}
        ontimer-stop={handleTimerStop}
      />
      <ui5-p13n-popup
        open={p13nOpen || undefined}
        style={{ height: "55rem", width: "45rem" }}
        title="Exercise List Settings"
        onclose={handleClose}
      >
        <ui5-selection-panel
          title="Select Columns"
          onChange={handleP13nChangeSelection}
          enable-reorder
        >
          {p13nData.map((item: any, index: number) => (
            <ui5-p13n-item
              key={index}
              name={item.name}
              label={item.label}
              visible={item.visible || undefined}
            ></ui5-p13n-item>
          ))}
        </ui5-selection-panel>
        <ui5-sort-panel title="Sort Columns" onChange={handleP13nChangeSorting}>
          {p13nSortData.map((item: any, index: number) => (
            <ui5-p13n-sort-item
              key={index}
              name={item.name}
              label={item.label}
              ascending={item.ascending || undefined}
              descending={item.descending || undefined}
            ></ui5-p13n-sort-item>
          ))}
        </ui5-sort-panel>
        <ui5-group-panel
          title="Group Column"
          onChange={handleP13nChangeGrouping}
        >
          {p13nData.map((item: any, index: number) => (
            <ui5-p13n-group-item
              key={index}
              name={item.name}
              label={item.label}
              grouped={item.grouped || undefined}
            ></ui5-p13n-group-item>
          ))}
        </ui5-group-panel>
        <ui5-filter-panel
          title="Filter Column"
          onChange={handleP13nChangeFilter}
        >
          {p13nData.map((item: any, index: number) => (
            <ui5-p13n-filter-item
              key={index}
              name={item.name}
              label={item.label}
              filter={item.filter??  undefined}
            ></ui5-p13n-filter-item>
          ))}
        </ui5-filter-panel>
      </ui5-p13n-popup>

      <ui5-bar
        id="tableToolbar"
        design="Header"
        accessible-name-ref="title"
        style={{ top: 0, zIndex: 2, height: "50px" }}
      >
        <ui5-title tabindsex="0" level="H3" id="title" slot="startContent">
          Exercises
        </ui5-title>
        <ui5-button
          id="dialogOpener"
          icon="action-settings"
          slot="endContent"
          onClick={handleP13nDialogOpener}
        ></ui5-button>
      </ui5-bar>
      <ui5-table
        id="exercisesTable"
        overflowMode="Popin"
        onrow-click={handleRowClick}
      >
        <ui5-table-header-row slot="headerRow">
          {tableData
            .filter((col: any) => col.visible)
            .map((col: any) => (
              <ui5-table-header-cell id={col.name}>
                <span>{col.label}</span>
              </ui5-table-header-cell>
            ))}
        </ui5-table-header-row>
        {exercises
          .sort(tableRowSorter(p13nSortData))
          .filter((ex) => {
            let returnValue = true;
            tableData.filter(col=>col.filter).forEach((col: any) => {
              if (col.filter !== ex[col.name].toString()) {
                returnValue = false;
              }                
            });
            return returnValue
          })
          .map((ex) => (
          <ui5-table-row
            row-key={ex.id}
            key={ex.id}
            interactive={tableIsInteractive}
          >
            {
              (textColor =
                exercise.id === ex.id
                  ? "var(--sapCriticalElementColor)"
                  : "var(--sapTextColor)")
            }
            {tableData
              .filter((col: any) => col.visible)
              .map((col: any) => (
                <ui5-table-cell>
                  <ui5-text>
                    <b style={{ color: textColor }}>{ex[col.name]}</b>
                  </ui5-text>
                </ui5-table-cell>
              ))}
          </ui5-table-row>
        ))}
      </ui5-table>
    </div>
  );
}

export default App;