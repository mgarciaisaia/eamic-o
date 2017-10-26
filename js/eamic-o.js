var puntos = [];

var board;
var f, curve; // global objects
var tablaDeDatos, ultimaFilaTabla;
var inlinePuntoX, inlinePuntoY;
var inputPrecision;

window.addEventListener("load", function(event) {
  board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox:[-5,8,8,-5], axis:true});

  var botonAgregarPunto = document.getElementById('agregarPunto');
  botonAgregarPunto.addEventListener('click', agregarPuntoApretado);

  tablaDeDatos = document.getElementById('tablaDeDatos');
  ultimaFilaTabla = document.getElementById('filaNuevoPunto');

  inlinePuntoX = document.getElementById('inlinePuntoX');
  inlinePuntoY = document.getElementById('inlinePuntoY');

  inputPrecision = document.getElementById('precision');

  document.getElementById('botonAproximarLineal').addEventListener('click', aproximarLineal);
  document.getElementById('botonAproximarCuadrado').addEventListener('click', aproximarCuadratico);
  document.getElementById('botonAproximarExponencial').addEventListener('click', aproximarExponencial);
  document.getElementById('botonAproximarPotencial').addEventListener('click', aproximarPotencial);
  document.getElementById('botonAproximarHiperbola').addEventListener('click', aproximarHiperbola);

  // [[1,1], [3,2], [4,4],[6,4], [8, 5],[9,7],[11,8],[14,9]].forEach(agregarPunto);
});

// funciones necesitadas por los modelos
var precision = function() { return inputPrecision.value || 0 }

var redondear = function(numero) {
  var re = new RegExp("(\\d+\\.\\d{" + precision() + "})(\\d)"),
    m = numero.toString().match(re);
  return m ? parseFloat(m[1]) : numero.valueOf();
};

var n = function() { return puntos.length; }
var x = function(punto) { return redondear(punto[0]); }
var y = function(punto) { return redondear(punto[1]); }
var xElevadoA = function(exponente) { return function(punto) { return redondear(Math.pow(x(punto), exponente)) } };
var xCuadrado = xElevadoA(2);
var xCubo = xElevadoA(3);
var xCuarta = xElevadoA(4);
var xPorY = function(punto) { return redondear(x(punto) * y(punto)); }
var lnY = function(punto) { return redondear(Math.log(y(punto))); }
var lnX = function(punto) { return redondear(Math.log(x(punto))); }
var lnXPorLnY = function(punto) { return redondear(lnX(punto) * lnY(punto)); }
var xPorLnY = function(punto) { return redondear(x(punto) * lnY(punto)); }
var unoDivididoY = function(punto) { return redondear(1/y(punto)); }
var lnXCuadrado = function(punto) { return redondear(Math.pow(lnX(punto), 2)); }
var XPorUnoDivididoY = function(punto) { return redondear(unoDivididoY(punto) * x(punto)); }


// Determinante de una matriz 3x3
var determinante = function(a) {
  return (
    (a[0][0] * a[1][1] * a[2][2]) +
    (a[0][1] * a[1][2] * a[2][0]) +
    (a[0][2] * a[1][0] * a[2][1]) -
    (a[0][2] * a[1][1] * a[2][0]) -
    (a[0][1] * a[1][0] * a[2][2]) -
    (a[0][0] * a[1][2] * a[2][1])
  )
}

// Recibe una matriz 3x4 y devuelve una 3x3 con las primeras 3 columnas
var d = function(a) {
  return [
    [ a[0][0], a[0][1], a[0][2] ],
    [ a[1][0], a[1][1], a[1][2] ],
    [ a[2][0], a[2][1], a[2][2] ]
  ]
}

// Recibe una matriz 3x4 y devuelve una 3x3 con la 4ta columna en lugar de la 1ra
var d1 = function(a) {
  return [
    [ a[0][3], a[0][1], a[0][2] ],
    [ a[1][3], a[1][1], a[1][2] ],
    [ a[2][3], a[2][1], a[2][2] ]
  ]
}

// Recibe una matriz 3x4 y devuelve una 3x3 con la 4ta columna en lugar de la 2da
var d2 = function(a) {
  return [
    [ a[0][0], a[0][3], a[0][2] ],
    [ a[1][0], a[1][3], a[1][2] ],
    [ a[2][0], a[2][3], a[2][2] ]
  ]
}

// Recibe una matriz 3x4 y devuelve una 3x3 con la 4ta columna en lugar de la 3ra
var d3 = function(a) {
  return [
    [ a[0][0], a[0][1], a[0][3] ],
    [ a[1][0], a[1][1], a[1][3] ],
    [ a[2][0], a[2][1], a[2][3] ]
  ]
}

// Modelo cuadrático

var aproximarCuadratico = function() {
  modeloCuadratico(puntos);
}

var modeloCuadratico = function(puntos) {
  var xCuartas = _.map(puntos, xElevadoA(4));
  var xCubos = _.map(puntos, xElevadoA(3));
  var xCuadrados = _.map(puntos, xElevadoA(2));
  var yPorXCuadrados = _.map(puntos, function(punto) { return y(punto) * xElevadoA(2)(punto) });
  var xs = _.map(puntos, x);
  var yPorX = _.map(puntos, function(punto) { return x(punto) * y(punto) });
  var ys = _.map(puntos, y);

  var sumaXCuarta = _.sum(xCuartas);
  var sumaXCubo = _.sum(xCubos);
  var sumaXCuadrado = _.sum(xCuadrados);
  var sumaXPorYCuadrado = _.sum(yPorXCuadrados);
  var sumaX = _.sum(xs);
  var sumaYPorX = _.sum(yPorX);
  var sumaY = _.sum(ys);
  var coeficientes = [
    [ sumaXCuarta, sumaXCubo, sumaXCuadrado, sumaXPorYCuadrado ],
    [ sumaXCubo, sumaXCuadrado, sumaX, sumaYPorX ],
    [ sumaXCuadrado, sumaX, n(), sumaY ]
  ];
  var a = determinante(d1(coeficientes)) / determinante(d(coeficientes));
  var b = determinante(d2(coeficientes)) / determinante(d(coeficientes));
  var c = determinante(d3(coeficientes)) / determinante(d(coeficientes));

  graficarFuncion("(" + a + " * x^2) + (" + b + " * x) + " + c);
}

var ecuacionLineal = function(componentes) {
  return ["\\begin{equation} \\begin{cases} &", componentes[0][0], componentes[0][1], " + ", componentes[0][2], componentes[0][3], " = ", componentes[0][4]," \\\\ ",
  "&", componentes[1][0], componentes[1][1], " + ", componentes[1][2], componentes[1][3], " = ", componentes[1][4], " \\end{cases} \\end{equation}"].join("")
}

var graficarSistemaDeEcuaciones = function(markupDeEcuaciones) {
  document.getElementById('sistemaEcuaciones').textContent = markupDeEcuaciones;
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

// Modelo lineal 

var aproximarLineal = function() {
  var sumaXCuadrados = _.sum(_.map(puntos, xCuadrado));
  var sumaXPorY = _.sum(_.map(puntos, xPorY));
  var sumaX = _.sum(_.map(puntos, x));
  var sumaY = _.sum(_.map(puntos, y));

  // REDONDEAR con .toPrecision()

  var losX = _.map(puntos, x);
  var losY = _.map(puntos, y);
  var datos = [losX, losY, _.map(puntos, xCuadrado), _.map(puntos, xPorY)];


  var b = (sumaXPorY - (sumaXCuadrados * sumaY / sumaX)) / (- (sumaXCuadrados * n() / sumaX) + sumaX);
  var a = (sumaY - (n() * b)) / sumaX;
  var aproximacion = function(x) { return (a * x) + b };

  var yRaya = _.map(losX, aproximacion);
  var diferenciaCuadrada = function(punto) {
    return Math.pow(aproximacion(x(punto)) - y(punto), 2);
  }

  var aproximar = aproximarLineal;

  var diferenciasCuadradas = _.map(puntos, diferenciaCuadrada);
  datos.push(yRaya, diferenciasCuadradas);
  for(var i = 0; i<datos[0].length; i++) {
    console.log(_.map(datos, function(columna) { return columna[i] }));
  }

  var errorCuadratico = _.sum(diferenciasCuadradas);
  console.log(errorCuadratico);
  graficarFuncion("(" + a + " * x) + " + b);
  graficarSistemaDeEcuaciones(
    ecuacionLineal([[sumaXCuadrados, 'a', sumaX, 'b', sumaXPorY], [sumaX, 'a', n(), 'b', sumaY]])
  )
};

var graficarPunto = function(punto) {
  board.create('point', [x(punto),y(punto)], {fixed: true});
}

var graficarFuncion = function(ecuacion) {
  console.log(ecuacion);
  if(curve) {
    curve.remove();
    curve = null;
  }
  f = board.jc.snippet(ecuacion, true, 'x', true);
  curve = board.create('functiongraph',[f,
    function(){
      var c = new JXG.Coords(JXG.COORDS_BY_SCREEN,[0,0],board);
      return c.usrCoords[1];
    },
    function(){
      var c = new JXG.Coords(JXG.COORDS_BY_SCREEN,[board.canvasWidth,0],board);
      return c.usrCoords[1];
    }
  ],{name:ecuacion, withLabel:true});
}

var nuevaFilaTabla = function(punto) {
  var nuevaCelda = function(texto) {
    var celda = document.createElement('td');
    celda.textContent = texto;
    return celda;
  }
  var fila = document.createElement('tr');
  fila.appendChild(nuevaCelda(x(punto)));
  fila.appendChild(nuevaCelda(y(punto)));
  fila.appendChild(nuevaCelda(xCuadrado(punto)));
  fila.appendChild(nuevaCelda(xCubo(punto)));
  fila.appendChild(nuevaCelda(xCuarta(punto)));
  fila.appendChild(nuevaCelda(xPorY(punto)));
  fila.appendChild(nuevaCelda(lnX(punto)));
  fila.appendChild(nuevaCelda(lnXCuadrado(punto)));
  fila.appendChild(nuevaCelda(lnY(punto)));
  fila.appendChild(nuevaCelda(lnXPorLnY(punto)));
  fila.appendChild(nuevaCelda(xPorLnY(punto)));
  fila.appendChild(nuevaCelda(unoDivididoY(punto)));
  fila.appendChild(nuevaCelda(XPorUnoDivididoY(punto)));
  fila.appendChild(nuevaCelda());
  fila.appendChild(nuevaCelda());
  return fila;
}

var agregarPunto = function(punto) {
  puntos.push(punto);
  ultimaFilaTabla.parentElement.insertBefore(nuevaFilaTabla(punto), ultimaFilaTabla);
  graficarPunto(punto);
}

var agregarPuntoApretado = function(event) {
  var punto = [parseFloat(inlinePuntoX.value), parseFloat(inlinePuntoY.value)]
  agregarPunto(punto);
  inlinePuntoX.value = '';
  inlinePuntoY.value = '';
}

function plotter() {
  var ecuacion = Math.E + " ^ x";
  f = board.jc.snippet(ecuacion, true, 'x', true);
  f = function(x) { return Math.pow(Math.E, x) };
  curve = board.create('functiongraph',[f,
                function(){
                  var c = new JXG.Coords(JXG.COORDS_BY_SCREEN,[0,0],board);
                  return c.usrCoords[1];
                },
                function(){
                  var c = new JXG.Coords(JXG.COORDS_BY_SCREEN,[board.canvasWidth,0],board);
                  return c.usrCoords[1];
                }
              ],{name:ecuacion, withLabel:true});
}

function clearAll() {
    JXG.JSXGraph.freeBoard(board);
    board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox:[-5,8,8,-5], axis:true});
    f = null;
    curve = null;
}

function addTangent() {
    if (JXG.isFunction(f)) {
        board.suspendUpdate();
        var p = board.create('glider',[1,0,curve], {name:'drag me'});
        board.create('tangent',[p], {name:'drag me'});
        board.unsuspendUpdate();
    }
}

function addDerivative() {
    if (JXG.isFunction(f)) {
        board.create('functiongraph',[JXG.Math.Numerics.D(f),
                function(){
                  var c = new JXG.Coords(JXG.COORDS_BY_SCREEN,[0,0],board);
                  return c.usrCoords[1];
                },
                function(){
                  var c = new JXG.Coords(JXG.COORDS_BY_SCREEN,[board.canvasWidth,0],board);
                  return c.usrCoords[1];
                }], {dash:2});
    }
}

// Modelo exponencial

var aproximarExponencial = function() {
  var sumaXCuadrados = _.sum(_.map(puntos, xCuadrado));
  var sumaXPorLnY = _.sum(_.map(puntos, xPorLnY));
  var sumaX = _.sum(_.map(puntos, x));
  var sumaY = _.sum(_.map(puntos, y));
  var sumaLnY = _.sum(_.map(puntos, lnY));

  // REDONDEAR con .toPrecision()

  var losX = _.map(puntos, x);
  var losY = _.map(puntos, y);
  var datos = [losX, losY, _.map(puntos, lnY), _.map(puntos, xCuadrado), _.map(puntos, xPorLnY)];


  var bMayuscula = (sumaXPorLnY - (sumaXCuadrados * sumaLnY / sumaX)) / (-(sumaXCuadrados * n()) / sumaX + sumaX) ;
  var aMayuscula = (sumaLnY - (n() * bMayuscula)) / sumaX;

  var a = aMayuscula;
  var b = Math.exp(bMayuscula);

  var aproximacion = function(x) { return b * Math.exp(a * x) };

  var yRaya = _.map(losX, aproximacion);
  var diferenciaCuadrada = function(punto) {
    return Math.pow(aproximacion(x(punto)) - y(punto), 2);
  }

  var diferenciasCuadradas = _.map(puntos, diferenciaCuadrada);
  datos.push(yRaya, diferenciasCuadradas);
  for(var i = 0; i<datos[0].length; i++) {
    console.log(_.map(datos, function(columna) { return columna[i] }));
  }

  var errorCuadratico = _.sum(diferenciasCuadradas);
  console.log(errorCuadratico);
  graficarFuncion(b  + " * " + Math.E + "^(" + a + " * x)");
};

// Modelo Potencial 

var aproximarPotencial = function() {
  var sumaLnXCuadrados = _.sum(_.map(puntos, lnXCuadrado));
  var sumaLnY = _.sum(_.map(puntos, lnY));
  var sumaLnX = _.sum(_.map(puntos, lnX));
  var sumaLnXPorLnY = _.sum(_.map(puntos, lnXPorLnY));

  // REDONDEAR con .toPrecision()

  var losX = _.map(puntos, x);
  var losY = _.map(puntos, y);
  var datos = [losX, losY,  _.map(puntos, lnX), _.map(puntos, lnY), _.map(puntos, lnXCuadrado), _.map(puntos, lnXPorLnY)];


  var bMayuscula = (sumaLnXPorLnY - (sumaLnXCuadrados * sumaLnY / sumaLnX)) / (-(sumaLnXCuadrados * n()) / sumaLnX + sumaLnX) ;
  var aMayuscula = (sumaLnY - (n() * bMayuscula)) / sumaLnX;

  var a = aMayuscula;
  var b = Math.exp(bMayuscula);

  var aproximacion = function(x) { return b * Math.pow(x, a)};

  var yRaya = _.map(losX, aproximacion);
  var diferenciaCuadrada = function(punto) {
    return Math.pow(aproximacion(x(punto)) - y(punto), 2);
  }

  var diferenciasCuadradas = _.map(puntos, diferenciaCuadrada);
  datos.push(yRaya, diferenciasCuadradas);
  for(var i = 0; i<datos[0].length; i++) {
    console.log(_.map(datos, function(columna) { return columna[i] }));
  }

  var errorCuadratico = _.sum(diferenciasCuadradas);
  console.log(errorCuadratico);
  graficarFuncion(b  + " * x^" + a );
};


// Modelo Hipérbola

var aproximarHiperbola = function() {
  var sumaXCuadrados = _.sum(_.map(puntos, xCuadrado));
  var sumaXPorUnoDivididoY = _.sum(_.map(puntos, XPorUnoDivididoY));
  var sumaX = _.sum(_.map(puntos, x));
  var sumaUnoDivididoY = _.sum(_.map(puntos, unoDivididoY));

  // REDONDEAR con .toPrecision()

  var losX = _.map(puntos, x);
  var losY = _.map(puntos, y);
  var datos = [losX, losY,  _.map(puntos, unoDivididoY), _.map(puntos, xCuadrado), _.map(puntos, XPorUnoDivididoY)];


  var bMayuscula = (sumaXPorUnoDivididoY - (sumaXCuadrados * sumaUnoDivididoY / sumaX)) / (-(sumaXCuadrados * n()) / sumaX + sumaX) ;
  var aMayuscula = (sumaUnoDivididoY - (n() * bMayuscula)) / sumaX;

  var a = 1/aMayuscula;
  var b = bMayuscula * a;

  var aproximacion = function(x) { return a/ (b + x)};

  var yRaya = _.map(losX, aproximacion);
  var diferenciaCuadrada = function(punto) {
    return Math.pow(aproximacion(x(punto)) - y(punto), 2);
  }

  var diferenciasCuadradas = _.map(puntos, diferenciaCuadrada);
  datos.push(yRaya, diferenciasCuadradas);
  for(var i = 0; i<datos[0].length; i++) {
    console.log(_.map(datos, function(columna) { return columna[i] }));
  }

  var errorCuadratico = _.sum(diferenciasCuadradas);
  console.log(errorCuadratico);
  graficarFuncion(a + "/" + "(" + b +" + x)");
};