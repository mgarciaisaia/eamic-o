import React, { Component } from 'react';
import './App.css';
import Precision from './Precision';
import PuntosDeDatos from './PuntosDeDatos';
import ComparativaModelos from './ComparativaModelos';
import Grafico from './Grafico';
import TablasDeCalculos from './TablasDeCalculos';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      puntos: [],
      precision: 5,
      modelos: {
        lineal: true,
        cuadratico: true,
        exponencial: true,
        potencial: true,
        hiperbolico: true
      }
    }

    this.actualizarPrecision = this.actualizarPrecision.bind(this);
    this.agregarPunto = this.agregarPunto.bind(this);
    this.borrarPunto = this.borrarPunto.bind(this);
    this.cambiarVisibilidadModelo = this.cambiarVisibilidadModelo.bind(this);
  }

  actualizarPrecision(nuevaPrecision) {
    this.setState({precision: nuevaPrecision})
  }

  agregarPunto(x, y) {
    this.setState(estado => ({puntos: [...estado.puntos, [x, y]]}))
  }

  borrarPunto(indice) {
    this.setState(estado => {
      let puntos = estado.puntos.slice();
      puntos.splice(indice, 1);
      return { puntos: puntos }
    })
  }

  cambiarVisibilidadModelo(modelo, valor) {
    this.setState(estado => ({modelos: {...estado.modelos, [modelo]: valor}}))
  }

  render() {
    return (
      <div>
        <h1>eAMIC-O™</h1>
        <pre>{JSON.stringify(this.state)}</pre>
        <Precision precision={this.state.precision} actualizarPrecision={this.actualizarPrecision} />
        <PuntosDeDatos puntos={this.state.puntos} borrarPunto={this.borrarPunto} agregarPunto={this.agregarPunto} />
        <ComparativaModelos modelos={this.state.modelos} cambiarVisibilidadModelo={this.cambiarVisibilidadModelo} />
        <Grafico />
        <TablasDeCalculos modelos={this.state.modelos} puntos={this.state.puntos} />
      </div>
    );
  }
}

export default App;
