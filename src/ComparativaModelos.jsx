import React, { Component } from 'react';
import {
  SelectionControl,
} from 'react-md';

class ComparativaModelos extends Component {
  render() {
    return (<div>
      <SelectionControl id="lineal-habilitado" type="switch" label="Lineal" defaultChecked={this.props.modelos.lineal} onChange={this.props.cambiarVisibilidadModelo.bind(this,'lineal') } />
      <SelectionControl id="cuadratico-habilitado" type="switch" label="Cuadrático" defaultChecked={this.props.cuadratico} onChange={this.props.cambiarVisibilidadModelo.bind(this,'cuadratico') } />
      <SelectionControl id="exponencial-habilitado" type="switch" label="Exponencial" defaultChecked={this.props.exponencial} onChange={this.props.cambiarVisibilidadModelo.bind(this,'exponencial') } />
      <SelectionControl id="potencial-habilitado" type="switch" label="Potencial" defaultChecked={this.props.potencial} onChange={this.props.cambiarVisibilidadModelo.bind(this,'potencial') } />
      <SelectionControl id="hiperbolico-habilitado" type="switch" label="Hiperbólico" defaultChecked={this.props.hiperbolico} onChange={this.props.cambiarVisibilidadModelo.bind(this,'hiperbolico') } />
    </div>
    )
  }
}

export default ComparativaModelos;
