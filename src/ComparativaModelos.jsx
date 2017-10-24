import React, { Component } from 'react';

class ComparativaModelos extends Component {
  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.props)}</pre>
      </div>
    )
  }
}

export default ComparativaModelos;
