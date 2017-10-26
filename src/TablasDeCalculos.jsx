import React, { Component } from 'react';
import {
  TabsContainer,
  Tabs,
  Tab,
} from 'react-md';
import TablaResultados from './TablaResultados';

// FIXME: precision deberia depender del estado de la aplicacion
var precision = function() { return 4 }

// TODO: mover a un calculos.js o algo para compartir con los cálculos de las gráficas
var redondear = function(numero) {
  var re = new RegExp("(\\d+\\.\\d{" + precision() + "})(\\d)"),
    m = numero.toString().match(re);
  return m ? parseFloat(m[1]) : numero.valueOf();
}
var x = function(punto) { return redondear(punto[0]); }
var y = function(punto) { return redondear(punto[1]); }
var xElevadoA = function(exponente) { return function(punto) { return redondear(Math.pow(x(punto), exponente)) } };
var xCuadrado = xElevadoA(2);
var xCubo = xElevadoA(3);
var xCuarta = xElevadoA(4);
var xPorY = function(punto) { return redondear(x(punto) * y(punto)); }
var xCuadradoPorY = function(punto) { return redondear(xCuadrado(punto) * y(punto)); }
var lnY = function(punto) { return redondear(Math.log(y(punto))); }
var lnX = function(punto) { return redondear(Math.log(x(punto))); }
var lnXPorLnY = function(punto) { return redondear(lnX(punto) * lnY(punto)); }
var xPorLnY = function(punto) { return redondear(x(punto) * lnY(punto)); }
var unoDivididoY = function(punto) { return redondear(1/y(punto)); }
var lnXCuadrado = function(punto) { return redondear(Math.pow(lnX(punto), 2)); }
var XPorUnoDivididoY = function(punto) { return redondear(unoDivididoY(punto) * x(punto)); }


class TablasDeCalculos extends Component {
  render() {
    let lineal = this.props.modelos.lineal ?
      <Tab label="Lineal">
        <TablaResultados puntos={this.props.puntos} calculos={[
          ['x', x],
          ['y', y],
          ['x^2', xCuadrado],
          ['xy', xPorY],
        ]} />
        {'{'}ax+by=c
        {'{'}ax+by=c
        ax+b=c
      </Tab>
      : null;
    let cuadratico = this.props.modelos.cuadratico ?
      <Tab label="Cuadrático">
        <TablaResultados puntos={this.props.puntos} calculos={[
          ['x', x],
          ['y', y],
          ['x^2', xCuadrado],
          ['x^3', xCubo],
          ['x^4', xCuarta],
          ['xy', xPorY],
          ['x^2 y', xCuadradoPorY],
        ]} />
        {'{'}ax+by=c
        {'{'}ax+by=c
        ax+b=c
      </Tab>
      : null;
    let exponencial = this.props.modelos.exponencial ?
      <Tab label="Exponencial">
        <TablaResultados puntos={this.props.puntos} calculos={[
          ['x', x],
          ['y', y],
          ['ln(y)', lnY],
          ['x^2', xCuadrado],
          ['x.ln(y)', xPorLnY],
        ]} />
        {'{'}ax+by=c
        {'{'}ax+by=c
        ax+b=c
      </Tab>
      : null;
    let potencial = this.props.modelos.potencial ?
      <Tab label="Potencial">
        <TablaResultados puntos={this.props.puntos} calculos={[
          ['x', x],
          ['y', y],
          ['ln(x)', lnX],
          ['ln(y)', lnY],
          ['ln(x)^2', lnXCuadrado],
          ['ln(x)ln(y)', lnXPorLnY],
        ]} />
        {'{'}ax+by=c
        {'{'}ax+by=c
        ax+b=c
      </Tab>
      : null;
    let hiperbolico = this.props.modelos.hiperbolico ?
      <Tab label="Hiperbólico">
        <TablaResultados puntos={this.props.puntos} calculos={[
          ['x', x],
          ['y', y],
          ['1/y', unoDivididoY],
          ['x^2', xCuadrado],
          ['x 1/y', XPorUnoDivididoY],
        ]} />
        {'{'}ax+by=c
        {'{'}ax+by=c
        ax+b=c
      </Tab>
      : null;
    return (
      <TabsContainer colored>
        <Tabs>
          {lineal}
          {cuadratico}
          {exponencial}
          {potencial}
          {hiperbolico}
        </Tabs>
      </TabsContainer>
    )
  }
}

export default TablasDeCalculos;
