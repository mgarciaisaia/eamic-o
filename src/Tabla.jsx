import React, { Component } from 'react';
import {
  Button,
  DataTable,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
} from 'react-md';

// FIXME: extraer a un math.js o algo asi
let x = (punto) => {
  return punto[0]
}
let y = (punto) => {
  return punto[1]
}
class Tabla extends Component {
  render() {
    return <DataTable plain={true}>
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
      </TableBody>
    </DataTable>
  }
}

export default Tabla;
