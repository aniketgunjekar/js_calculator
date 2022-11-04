//react import
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { useState } from 'react';

//import style file
import "./index.scss";

//rendering api
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MyCalculator />
  </React.StrictMode>
);

//React App --
let evalCounter = 0;
let acCounter = 0;
//display child element --
function Display({formula, current, history}) {
  return (
    <div>
      <div id="mainDisplay">
        {evalCounter != 0 && <p id="finalExp">{history[history.length - 1]} =</p>}
        <p id="display">{formula}</p>
      </div>
      <p id="currentDisplay">{current}</p>
    </div>
  );
}

//input child element --
let key = 0;
function Controller({formula, setFormula, current, setCurrent, history, setHistory}) {
  function handleClick(input) {
    //current states logic    -----   "current" state   -----
    //arithmatic operator test on current
    if(/[\*\/\+\-]/.test(input)) {
      setCurrent(input);
    } 
    //digit input handler
    if(/\d/.test(input)) {
      if(current == "0") {
        setCurrent(input);
      } else if(evalCounter != 0) {
        setCurrent(input);
      } else if(/[\*\/\+\-]/.test(current)) {
        setCurrent(input);
      } else {
        setCurrent(current + input);
      }
    };
    //decimal handler
    if(input == ".") {
      if(/\./.test(current)) {
        return;
      } else if(/[\*\/\+\-]/.test(current)) {
        setCurrent("0" + input);
      } else if(evalCounter != 0) {
        setCurrent("0" + input);
      } else {
        setCurrent(current + input);
      }
    }
    //wipe[ac] handler
    if(input == "AC") {
      setCurrent("0");
    };

    //formula logic   -----   "formula" state   -----
    //[0-9] input handler
    if(/\d/.test(input)) {
      acCounter = 0;  // reset ac button
      if(formula == "0") {
        setFormula(input);
      } else if(evalCounter != 0) {
        setFormula(input);
        evalCounter = 0; //reset evalCouter with dependency in current digit handler
      } else {
        setFormula(formula + input);
      }
    };
    //decimal point handler
    if(input == ".") {
      acCounter = 0;  // reset ac button
      if(/\./.test(current)) {
        return;
      } else if (/[\*\/\+\-]$/.test(formula)) {
        setFormula(formula + "0" + input);
      } else if(evalCounter != 0) {
        setFormula("0" + input);
        evalCounter = 0;  //reset
      } else {
        setFormula(formula + input);
      }
    };
    //multiplication, division, addition formula logic handler
    if(/[\*\/\+]/.test(input)) {
      evalCounter = 0; //reset evalCounter
      acCounter = 0;  // reset ac button
      if(/([\*\/\+\-][\-])$/.test(formula)) {
        setFormula(formula.replace(/([\*\/\+\-][\-])$/, input));
      } else if(/[\*\/\+\-]$/.test(formula)) {
        setFormula(formula.replace(/[\*\/\+\-]$/, input));
      } else {
        setFormula(formula + input);
      }
    };
    //subtraction handler
    if(input == "-") {
      evalCounter = 0; //reset evalCounter
      acCounter = 0;  // reset ac button
      if(/([\*\/\+\-][\-])$/.test(formula)) {
        return;
      } else {
        setFormula(formula + input);
      }
    };
    //handle formula,current evaluation
    if(input == "=") {
      //  * NOTES
      //  ** calls to setstate are batched by react handlers to prevent multiple renders
      //  ** this causes asynchrounous calls to setState or useState hooks
      //  ** which disrupts the functionality of component if it has synchrounous dependency
      //  ** to resolve this
      //  ** use a variable to keep the memory of updates until you finally call the setState with the finalized value like done below;
      //  ** or use updater functions (arrow/anonymous functions) [mentioned in docs]

      evalCounter++;  // this variable keeps track of evalute operator presses which is required by most of the programme.
      let exp = formula;  // tentatively stores the memory and updates of formula state to prevent batched renders.
      if(evalCounter == 1) { // this condition ensures that evaluate operator runs once cosecutively.
        if(/[\*\/\+\-\.]+$/.test(formula)) {
          // setFormula(formula.replace(/[\*\/\+\-\.]$/, ""));  // batched call need promise or settimeout
          exp = exp.replace(/[\*\/\+\-\.]+$/, "");  // ensures synchronous behaviour
        }
        if(/[\-][\-]/.test(formula)) {
          // setFormula(formula.replace(/[\-][\-]/, "+"));  // batched call need promise or settimeout
          exp = exp.replace(/[\-][\-]/, "+");   // ensures synchronous behaviour
        }
        setHistory(history.concat(<span key={key++}>{exp}</span>));
        // setFormula(new String(eval(formula)));
        // setCurrent(new String(eval(formula)));
        // setFormula(`${eval(formula)}`);
        let val = (eval(exp)).toString();
        console.log(val);
        setFormula(val);
        setCurrent(val);
      }
    };
    //wipe[ac] handler
    if(input == "AC") {
      if(acCounter == 0) {
        evalCounter = 0;
        acCounter++;
        setFormula("0");
        setHistory(history.concat(<span key={key++}>--All Clear--</span>));
      }
    };
  }

  return (
    <div id="controller">
      <p id="clear" onClick={() => handleClick("AC")}>AC</p>
      <p id="divide" onClick={() => handleClick("/")}>/</p>
      <p id="multiply" onClick={() => handleClick("*")}>X</p>
      <p id="seven" onClick={() => handleClick("7")}>7</p>
      <p id="eight" onClick={() => handleClick("8")}>8</p>
      <p id="nine" onClick={() => handleClick("9")}>9</p>
      <p id="subtract" onClick={() => handleClick("-")}>-</p>
      <p id="four" onClick={() => handleClick("4")}>4</p>
      <p id="five" onClick={() => handleClick("5")}>5</p>
      <p id="six" onClick={() => handleClick("6")}>6</p>
      <p id="add" onClick={() => handleClick("+")}>+</p>
      <p id="one" onClick={() => handleClick("1")}>1</p>
      <p id="two" onClick={() => handleClick("2")}>2</p>
      <p id="three" onClick={() => handleClick("3")}>3</p>
      <p id="equals" onClick={() => handleClick("=")}>=</p>
      <p id="zero" onClick={() => handleClick("0")}>0</p>
      <p id="decimal" onClick={() => handleClick(".")}>.</p>
    </div>
  );
}

//parent app --
function MyCalculator() {
  const [formula, setFormula] = useState("0");
  const [current, setCurrent] = useState("0");
  const [history, setHistory] = useState(["history"]);

  return (
    <div>
      <Display formula={formula} current={current} history={history} />
      <Controller formula={formula} setFormula={setFormula} current={current} setCurrent={setCurrent} history={history} setHistory={setHistory} />
      <p id="credit">Designed and Coded By</p>
      <p id="author">Aniket Gunjekar</p>
      {history.length >= 2 && <div id="history">{history}</div>}
    </div>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
