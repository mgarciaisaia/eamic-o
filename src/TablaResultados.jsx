import React, { Component } from 'react';
import {
  DataTable,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
} from 'react-md';
import _ from 'lodash';

let expresion = (calculo) => calculo[0]
let funcion = (calculo) => calculo[1]

class TablaResultados extends Component {
  render() {
    return <DataTable plain={true}>
      <TableHeader>
        <TableRow>
          {this.props.calculos.map((calculo) => (
            <TableColumn key={expresion(calculo)}>`{expresion(calculo)}`</TableColumn>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {this.props.puntos.map((punto) => (
          <TableRow key={`${punto[0]}-${punto[1]}`}>
            {this.props.calculos.map((calculo) => (
              <TableColumn key={expresion(calculo)}>{funcion(calculo)(punto)}</TableColumn>
            ))}
          </TableRow>
        ))}
        <TableRow className="sumatoria">
          {this.props.calculos.map((calculo) => (
            <TableColumn key={expresion(calculo)}>
            {_.sum(this.props.puntos.map((punto) => funcion(calculo)(punto)))}
            </TableColumn>
          ))}
        </TableRow>
      </TableBody>
    </DataTable>
  }
}

export default TablaResultados;
