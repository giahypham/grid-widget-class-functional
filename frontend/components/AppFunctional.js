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
  const [steps, setSteps] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
 


  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = (currentIndex%3) + 1;
    const y = Math.floor(currentIndex/3) + 1;
    return {x, y};
    
  }
  
  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    
    const { x, y } = getXY();
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
    const { x, y } = getXY();
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
    const newIndex = getNextIndex(direction)

    const direction = evt.target.id

    if (newIndex !== currentIndex){
      setSteps((prevSteps) => prevSteps + 1)
      setCurrentIndex(newIndex)
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.

  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates (2, 2)</h3>
        <h3 id="steps">You moved 0 times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === 4 ? ' active' : ''}`}>
              {idx === 4 ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message"></h3>
      </div>
      <div id="keypad">
        <button id="left">LEFT</button>
        <button id="up">UP</button>
        <button id="right">RIGHT</button>
        <button id="down">DOWN</button>
        <button id="reset">reset</button>
      </div>
      <form>
        <input id="email" type="email" placeholder="type email"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
