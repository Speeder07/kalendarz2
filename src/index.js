import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import React, { useState, useEffect } from 'react';
import { db, colRef } from './firebase';
import {getFirestore, collection, getDocs, doc, deleteDoc, addDoc} from 'firebase/firestore';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSave, faPlus, faMinus, faCircleArrowLeft, faCircleArrowRight, faArrowUp} from '@fortawesome/free-solid-svg-icons';
import { render } from '@testing-library/react';

const months = new Array('Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień');

function daysInMonth(month, year) {
  return 
}

class MainMenager extends React.Component
{

  constructor(props) 
  {
    super(props);
    this.state = {events: new Array(), year: 2022, month: -1, week: -1};  
    this.setYear = this.setYear.bind(this);
    this.setMonthViev = this.setMonthViev.bind(this);
    this.setWeek = this.setWeek.bind(this);
  }
  
  setWeek(weekNumber)
  {
    this.setState({week: weekNumber});
  }

  setMonthViev(monthNumber)
  {
    this.setState({month: monthNumber});
  }

  setYear(value)
  {
    this.setState({year: this.state.year+value});
  }

  componentDidMount()
  {
    let data = new Date();
    this.setState({year: data.getFullYear()});
    this.getEvents();
  }
  

  async getEvents()
  {
    getDocs(colRef)
    .then((snapshot)=> {
        let events = []
        snapshot.docs.forEach((doc)=>{
            events.push({...doc.data(), id: doc.id})
        })
        this.setState({events: events,});
        events = events;
        console.log(events);
    })
    .catch(err => {
        console.log(err.message);
    })
  }

  render()
  {
    let thisYeraEvents = new Array();
    for (let index = 0; index < this.state.events.length; index++) {
      if (this.state.events[index].Year==this.state.year) {
        thisYeraEvents.push(this.state.events[index]);
      }
    }

    let display;
    if (this.state.week!=-1) {
      display = <WeekViev events={this.state.events} year={this.state.year} monthNumber={this.state.month} weekNumber={this.state.week} setWeek={this.setWeek}/>;
    }
    else if (this.state.month!=-1) {
      display = <MonthViev year={this.state.year} monthNumber={this.state.month} setMonth={this.setMonthViev} setWeek={this.setWeek}/>;
    }
    else{
      display = <YearViev events={thisYeraEvents} year={this.state.year} setYear={this.setYear} setMonth={this.setMonthViev}/>;
    }
    return(<div>
      {display}
    </div>
      
    )
  }
}


function YearViev(params) {
  return(
    <div id='year'>
      <div className='y_row'>
        <p id='y_name'>Rok {params.year}</p>
        <button onClick={()=>params.setYear(-1)}><FontAwesomeIcon icon={faCircleArrowLeft} /></button>
        <button onClick={()=>params.setYear(1)}><FontAwesomeIcon icon={faCircleArrowRight} /></button>
      </div>
      
      <div id='y_container'>

      
      {Array(12).fill(1).map((el, i) =>
        {
          let temp = new Array();
          params.events.map((even, eId)=>{
            if (even.Month-1==i) {
              temp.push(even);
            }
          })
          return(<MonthTileButton monthNumber={i} setMonth={params.setMonth}/>);
        }
        
      )}
      </div>
    </div>
    
  )
}

function MonthTileButton(params) {
  return(
    <div className='monthTileButton' onClick={()=>params.setMonth(params.monthNumber)}>
      <div className='monthTileButtonContent' >
        {months[params.monthNumber]}
      </div>
    </div>
  )
}

function MonthViev(params) {
  let first_day = new Date(params.year, params.monthNumber, 1).getDay();
  let enpty_spaces = (first_day==0) ? 6 : first_day-1;
  let daysInMonth = new Date(params.year, params.monthNumber+1, 0).getDate();

  let numberOfWeeks =  Math.floor((enpty_spaces + daysInMonth) / 7) +1;
  

  return(
    <div>
      <div className='monthHeader'>
        <button onClick={()=>params.setMonth(-1)}><FontAwesomeIcon icon={faArrowUp} /></button>
        {months[params.monthNumber]}
        <button onClick={()=>params.setMonth((params.monthNumber>=1)?params.monthNumber-1:params.monthNumber)}><FontAwesomeIcon icon={faCircleArrowLeft} /></button>
        <button onClick={()=>params.setMonth((params.monthNumber<=10)?params.monthNumber+1:params.monthNumber)}><FontAwesomeIcon icon={faCircleArrowRight} /></button>
        
      </div>
      <div className='monthContent'>
      {Array(numberOfWeeks).fill(1).map((el, id) =>
        {
          return(<WeekTileButton week={id} setWeek={params.setWeek}/>);
        }
      )}
      </div>
    </div>
  )
}

function WeekTileButton(params) {
  
  return(
    <div className='weekTileButton' onClick={()=>params.setWeek(params.week)}>
      <div className='weekTileContent'>
        Week {params.week+1}
      </div>
    </div>
  )
}

function WeekViev(params) {
  let first_day = new Date(params.year, params.monthNumber, 1).getDay();
  let enpty_spaces = (first_day==0) ? 6 : first_day-1;
  let daysInMonth = new Date(params.year, params.monthNumber+1, 0).getDate();

  let numberOfWeeks =  Math.floor((enpty_spaces + daysInMonth) / 7) +1;

  let daysInPrevMonth;
  if (params.monthNumber!=0) {
    daysInPrevMonth = new Date(params.year, params.monthNumber, 0).getDate();
  }
  else{
    daysInPrevMonth = new Date(params.year-1, 12, 0).getDate();
  }

  let temp = 0;
  return(
    <div>
      <div className='weekHeader'>
        <button onClick={()=>params.setWeek(-1)}><FontAwesomeIcon icon={faArrowUp} /></button>
        {months[params.monthNumber]+", "+(params.weekNumber+1)+" Tydzień"}
        <button onClick={()=>params.setWeek((params.weekNumber>=1)?params.weekNumber-1:params.weekNumber)}><FontAwesomeIcon icon={faCircleArrowLeft} /></button>
        <button onClick={()=>params.setWeek((params.weekNumber<numberOfWeeks-1)?params.weekNumber+1:params.weekNumber)}><FontAwesomeIcon icon={faCircleArrowRight} /></button>
        
      </div>
      <div className='weekContent'>
        {Array(7).fill(1).map((el, i) =>
          {
            if (params.weekNumber==0) {
              if (i<enpty_spaces) {
                return <div className='dayFalse'><div>{daysInPrevMonth-enpty_spaces+(i+1)}</div></div>
              }
              else{
                return <DayVievTile events={params.events} dayNumber={i-enpty_spaces+1} monthNumber={params.monthNumber} year={params.year}/>
              }

            }
            else if (params.weekNumber==numberOfWeeks-1) {
              
              if (params.weekNumber*7+i-enpty_spaces+1 > daysInMonth) {
                return <div className='dayFalse'><div>{i-temp+1}</div></div>
              }
              else{
                temp+=1;
                return <DayVievTile events={params.events} dayNumber={params.weekNumber*7+i-enpty_spaces+1} monthNumber={params.monthNumber} year={params.year}/>
              }
            }
            else{
              return <DayVievTile events={params.events} dayNumber={params.weekNumber*7+i-enpty_spaces+1} monthNumber={params.monthNumber} year={params.year}/>
            }

          }
        )}
      </div>
    </div>
  )
}


function DayVievTile(params) {
  const [listCount, setListCount] = useState(0);
  const [listTitles, setListTitles] = useState(new Array());

  function FindEvent() {
    for (let index = 0; index < params.events.length; index++) {
      if (params.events[index].Day == params.dayNumber &&
        params.events[index].Month == params.monthNumber+1 &&
        params.events[index].Year == params.year) 
      {
        return params.events[index];
      }
    }
    return '';
  }

  function CorectData(event) {
    if (event!="") {
      let words = event.Text.split(" ");
      setListCount(words.length);
      setListTitles(words);
    }
    else{
      setListCount(0);
      setListTitles(new Array());
    }
    
  }

  function GetText() {
    let text="";
    for (let index = 0; index < listTitles.length; index++) {
      text += listTitles[index];
      if (index!=listTitles.length-1) {
        text+=" ";
      }
    }
    return text;
  }

  function HandleChange(e, index) {
      let arrayTemp = listTitles;
      arrayTemp[index] = e.target.value;
      setListTitles(arrayTemp);
      console.log(listTitles);
  }

  function Save() {
    let dayEvent = FindEvent();
    if (dayEvent!='') {
      const docRef = doc(db, 'events', dayEvent.id);
      deleteDoc(docRef);

      
    }
    addDoc(colRef, {Year: params.year, Month: params.monthNumber+1, Day: params.dayNumber, Text: GetText(),})
      .then(()=>{window.location.reload(true)})
  }

  useEffect(() => {
    CorectData(FindEvent());
    /*setListCount(0);
    setListTitles(new Array());
    setDayEvent("");*/
    
  }, [params.dayNumber]);
  
  return(
    <div className='dayViev'>
      <div className='dayVievHeader'>
        <div>{params.dayNumber}</div>
        <button onClick={()=>setListCount(listCount+1)}><FontAwesomeIcon icon={faPlus} /></button>
        <button onClick={Save}><FontAwesomeIcon icon={faSave} /></button>
      </div>
      <form id={'form'+params.dayNumber}>
      {Array(listCount).fill(1).map((el, i) =>
          {
            return <div className='inputField'>
              <input className='inputDay' id={'form'+" "+params.dayNumber+" "+i} value={listTitles[i]} type="text" onChange={(e)=>{HandleChange(e, i)}}></input>
            </div>
          }
        )}
      </form>
      
    </div>
    
    
  )
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


ReactDOM.render(
  <MainMenager/>,
  document.getElementById('root')
);