import React, { Component } from 'react';
import Tabla from './Tabla';
import AgregadorPunto from './AgregadorPunto';

class PuntosDeDatos extends Component {
  render() {
    return (
      <div className="puntosDeEntrada">
        <h2>Puntos de entrada</h2>
        <Tabla puntos={this.props.puntos} borrarPunto={this.props.borrarPunto} />
        <AgregadorPunto agregarPunto={this.props.agregarPunto} />
      </div>
    )
  }
}

export default PuntosDeDatos;
