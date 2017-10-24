import React, { Component } from 'react';

class Tabla extends Component {
  render() {
    return <table>{JSON.stringify(this.props.puntos)}</table>
  }
}

export default Tabla;
