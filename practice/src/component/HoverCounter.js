import React, { Component } from 'react'
import UpdatedComponent from './withCounter'

 class HoverCounter extends Component {
    constructor(props) {
        super(props)

        this.state = {
            count: 0
        }
    }

    incrementCount=()=>{
        this.setState(prevState => {
            return {count: prevState.count + 1}
        })
    }
  render() {
      const {count}=this.state;
    return (
      <div>
       <button onMouseOver={this.incrementCount}>{this.props.name} Hovered {count} Times </button>
      </div>
    )
  }
}


export default UpdatedComponent(HoverCounter);