import React, { Component } from 'react';
import { TextField } from 'react-md';

class Precision extends Component {
  render() {
    return (<div>
      <TextField label="Precisión" id="input-precision" value={this.props.precision} onChange={this.props.actualizarPrecision} />
      {/* <label htmlFor="decimales">Cantidad de decimales</label>
      <input type="text" value={this.props.precision} onChange={this.props.cambioPrecision} /> */}
    </div>)
  }
}

export default Precision;
