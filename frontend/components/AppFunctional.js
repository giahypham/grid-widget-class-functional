import React from 'react'
import { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  //create state

  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
 


  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = (currentIndex%3) + 1;
    const y = Math.floor(currentIndex/3) + 1;
    return [x, y];
    
  }
  
  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    
    const [x, y] = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage)
    setEmail(initialEmail)
    setSteps(0)
    setCurrentIndex(initialIndex)
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const [ x, y ] = getXY();
    const gridSize = 3;

    //new coordinates 
    let newX = x;
    let newY = y;

    if (direction === 'left' && x > 1) {
      newX = x - 1;
    } else if (direction === 'up' && y > 1) {
      newY = y - 1;
    } else if (direction === 'right' && x < gridSize) {
      newX = x + 1;
    } else if (direction === 'down' && y < gridSize) {
      newY = y + 1;
    }

    const newIndex = (newY - 1) * gridSize + (newX - 1); //index = cell_row * columns_in_grid + cell_column 

    // Return the new index or the current index if the move is impossible
    return newIndex === currentIndex ? currentIndex : newIndex;
  
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id;
    const newIndex = getNextIndex(direction);

    if (newIndex !== currentIndex){
      setCurrentIndex(newIndex);
      setSteps((prevSteps) => prevSteps + 1);
      setMessage('');
    }else{
      setMessage("You can't go " + direction);
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    const inputValue = evt.target.value
    setEmail(inputValue);
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();

    const [ x, y ] = getXY(); 

    axios.post('http://localhost:9000/api/result', {
      email: email,
      steps: steps,
      x: x,
      y: y,
    })
    .then((resp) => resp.data.message)
    .catch((err) => err.resp.data.message)
    .finally(() => {
      setMessage(message);
    })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === currentIndex ? ' active' : ''}`}>
              {idx === currentIndex ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form>
        <input id="email" type="email" onChange={onChange} value={email} placeholder="type email"></input>
        <input id="submit" type="submit" onSubmit={onSubmit}></input>
      </form>
    </div>
  )
}
