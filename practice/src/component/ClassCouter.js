import React, { Component } from 'react';

export default class ClassCounter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,          // Integer
      isActive: false,   // Boolean
      message: "Hello!"  // String
    };
  }

  render() {
    return (
      <div>
        <h1>Count: {this.state.count}</h1>
        <h2>Status: {this.state.isActive ? "Active" : "Inactive"}</h2>
        <h3>Message: {this.state.message}</h3>
      </div>
    );
  }
}
