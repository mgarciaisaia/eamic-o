import React, { Component } from 'react';
import {
  Button,
  DataTable,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TextField,
} from 'react-md';
import _ from 'lodash';

// FIXME: extraer a un math.js o algo asi
let x = (punto) => {
  return punto[0]
}
let y = (punto) => {
  return punto[1]
}

class PuntosDeDatos extends Component {
  constructor(props) {
    super(props);
    this.state = { x: '', y: '' }
    this.manejarAgregarPunto = this.manejarAgregarPunto.bind(this);
    this.actualizarX = this.actualizarX.bind(this);
    this.actualizarY = this.actualizarY.bind(this);
  }
  manejarAgregarPunto() {
    this.props.agregarPunto(Number.parseFloat(this.state.x), Number.parseFloat(this.state.y));
    this.setState({x: '', y: ''})
  }
  actualizarX(nuevoX) {
    this.setState({x: nuevoX})
  }
  actualizarY(nuevoY) {
    this.setState({y: nuevoY})
  }

  render() {
    return (
      <div className="puntosDeEntrada">
        <h2>Puntos de entrada</h2>
        <DataTable plain={true}>
          <TableHeader>
            <TableRow>
              <TableColumn>x</TableColumn>
              <TableColumn>y</TableColumn>
              <TableColumn />
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.props.puntos.map((punto, i) => (
              <TableRow key={`${x(punto)}-${y(punto)}`}>
                <TableColumn>{x(punto)}</TableColumn>
                <TableColumn>{y(punto)}</TableColumn>
                <TableColumn><Button icon onClick={this.props.borrarPunto.bind(this, i)}>delete</Button></TableColumn>
              </TableRow>
            ))}
            <TableRow className="sumatoria">
              <TableColumn>{_.sum(this.props.puntos.map((punto) => x(punto)))}</TableColumn>
              <TableColumn>{_.sum(this.props.puntos.map((punto) => y(punto)))}</TableColumn>
              <TableColumn></TableColumn>
            </TableRow>
            <TableRow>
              <TableColumn><TextField label="x" id="input-nuevo-x" value={this.state.x} onChange={this.actualizarX} /></TableColumn>
              <TableColumn><TextField label="y" id="input-nuevo-y" value={this.state.y} onChange={this.actualizarY} /></TableColumn>
              <TableColumn><Button icon onClick={this.manejarAgregarPunto}>add</Button></TableColumn>
            </TableRow>
          </TableBody>
        </DataTable>
      </div>
    )
  }
}

export default PuntosDeDatos;
