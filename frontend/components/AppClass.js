import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(props){
    super(props)

    this.state = {
      message: initialMessage,
      email: initialEmail,
      currentIndex: initialIndex,
      steps: initialSteps,
    }
  }

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const { currentIndex } = this.state.currentIndex
    const x = (currentIndex % 3) + 1
    const y = Math.floor(currentIndex/3) + 1
    return [x, y]
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const [x, y] = this.getXY()
    return `Coordinates (${x}, ${y})`
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({...this.state,
      message: initialMessage,
      email: initialEmail,
      steps: initialSteps,
      index: initialIndex
    })
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const [x, y] = this.getXY()
    const {currentIndex} = this.state.currentIndex
    const gridSize = 3

    let newX = x
    let newY = y
    
    if (direction === 'left' && x > 1) {
      newX = x - 1
    }else if(direction === 'up' && y > 1) {
      newY = y - 1
    } else if (direction === 'right' && x < gridSize) {
      newX = x + 1
    } else if (direction === 'down' && y < gridSize) {
      newY = y + 1
    }

    const newIndex = (newY - 1)* gridSize + (newX - 1)
    return newIndex === currentIndex ? currentIndex : newIndex
  }


  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const {currentIndex} = this.state.currentIndex
    const direction = evt.target.id
    const newIndex = this.getNextIndex(direction)

    if (newIndex !== currentIndex){
      this.setState((prevState) => ({
        index: newIndex,
        steps: prevState.steps + 1,
        message: "",
      }))
    } else {
      this.setState({...this.state, message: `You can't go ${direction}`})
    }
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    const inputValue = evt.target.inputValue
    this.setState({...this.state,
      email: inputValue
    })
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    const [x, y] = this.getXY()

    axios
    .post('http://localhost:9000/api/result', {
      email: this.state.email,
      steps: this.state.steps,
      x: x,
      y: y,
    })
    .then((resp) => this.setState({...this.state, message: resp.data.message }))
    .catch((err) => {
      if (err.response) {
        this.setState({ ...this.state, message: err.response.data.message })
      } else {
        this.setState({ ...this.state, message: 'Error: ' + err.message })
      }
    })
  
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.currentIndex ? ' active' : ''}`}>
                {idx === this.state.currentIndex ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form>
          <input id="email" type="email" placeholder="type email" value={this.state.email}></input>
          <input id="submit" type="submit" onSubmit={this.onSubmit}></input>
        </form>
      </div>
    )
  }
}
