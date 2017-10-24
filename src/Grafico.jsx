import React, { Component } from 'react';

class Grafico extends Component {
  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.props)}</pre>
      </div>
    )
  }
}

export default Grafico;
