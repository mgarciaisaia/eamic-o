import React, { Component } from 'react';

class AgregadorPunto extends Component {
  constructor(props) {
    super(props);
    this.state = { x: '', y: '' }
    this.manejarAgregarPunto = this.manejarAgregarPunto.bind(this);
    this.actualizarX = this.actualizarX.bind(this);
    this.actualizarY = this.actualizarY.bind(this);
  }

  manejarAgregarPunto() {
    this.props.agregarPunto(Number.parseInt(this.state.x, 10), Number.parseInt(this.state.y, 10));
    this.setState({x: '', y: ''})
  }

  actualizarX(evento) {
    this.setState({x: evento.target.value})
  }

  actualizarY(evento) {
    this.setState({y: evento.target.value})
  }

  render() {
    return <span>
      <span>{JSON.stringify(this.state)}</span>
      <label htmlFor="x">x</label>
      <input type="number" name="x" value={this.state.x} onChange={this.actualizarX} />
      <label htmlFor="y">y</label>
      <input type="number" name="y" value={this.state.y} onChange={this.actualizarY} />
      <input type="button" value="Agregar!" onClick={this.manejarAgregarPunto} />
    </span>
  }
}

export default AgregadorPunto;
