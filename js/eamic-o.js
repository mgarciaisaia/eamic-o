var data = [];

var board;
var f, curve; // global objects
var tablaDeDatos, ultimaFilaTabla;
var nuevoX, nuevoY;

window.addEventListener("load", function(event) {
  board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox:[-5,8,8,-5], axis:true});

  var botonAgregarPunto = document.getElementById('agregarPunto');
  botonAgregarPunto.addEventListener('click', agregarPuntoApretado);

  tablaDeDatos = document.getElementById('tablaDeDatos');
  ultimaFilaTabla = document.getElementById('filaNuevoPunto');

  nuevoX = document.getElementById('nuevoX');
  nuevoY = document.getElementById('nuevoY');

  document.getElementById('botonAproximar').addEventListener('click', aproximar);

  [[1,1], [3,2], [4,4],[6,4], [8,5],[9,7],[11,8],[14,9]].forEach(agregarPunto);
});

var x = function(punto) {
  return punto[0];
}

var y = function(punto) {
  return punto[1];
}

var n = function() {
  return data.length;
}

var xCuadrado = function(punto) {
  return x(punto) * x(punto);
}

var xPorY = function(punto) {
  return x(punto) * y(punto);
}

var aproximar = function() {
  var sumaXCuadrados = _.sum(_.map(data, xCuadrado));
  var sumaXPorY = _.sum(_.map(data, xPorY));
  var sumaX = _.sum(_.map(data, x));
  var sumaY = _.sum(_.map(data, y));

  // REDONDEAR con .toPrecision()

  var losX = _.map(data, x);
  var losY = _.map(data, y);
  var datos = [losX, losY, _.map(data, xCuadrado), _.map(data, xPorY)];


  var b = (sumaXPorY - (sumaXCuadrados * sumaY / sumaX)) / (- (sumaXCuadrados * n() / sumaX) + sumaX);
  var a = (sumaY - (n() * b)) / sumaX;
  var aproximacion = function(x) { return (a * x) + b };

  var yRaya = _.map(losX, aproximacion);
  var diferenciaCuadrada = function(punto) {
    return Math.pow(aproximacion(x(punto)) - y(punto), 2);
  }

  var diferenciasCuadradas = _.map(data, diferenciaCuadrada);
  datos.push(yRaya, diferenciasCuadradas);
  for(var i = 0; i<datos[0].length; i++) {
    console.log(_.map(datos, function(columna) { return columna[i] }));
  }

  var errorCuadratico = _.sum(diferenciasCuadradas);
  console.log(errorCuadratico);
  graficarFuncion("(" + a + " * x) + " + b);
};

var graficarPunto = function(punto) {
  board.create('point', [x(punto),y(punto)], {fixed: true});
}

var graficarFuncion = function(ecuacion) {
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
  return fila;
}

var agregarPunto = function(punto) {
  data.push(punto);
  ultimaFilaTabla.parentElement.insertBefore(nuevaFilaTabla(punto), ultimaFilaTabla);
  graficarPunto(punto);
  // clearAll();
  // plotter();
}

var agregarPuntoApretado = function(event) {
  var punto = [parseFloat(nuevoX.value), parseFloat(nuevoY.value)]
  agregarPunto(punto);
  nuevoX.value = '';
  nuevoY.value = '';
  nuevoX.focus();
  nuevoX.scrollIntoView();
}

function plotter() {
  var ecuacion = Math.E + " ^ x";
  f = board.jc.snippet(ecuacion, true, 'x', true);
  // debugger;
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
  // var q = board.create('glider', [2, 1, curve], {withLabel:false});
  // var t = board.create('text', [
  //         function(){ return q.X()+0.1; },
  //         function(){ return q.Y()+0.1; },
  //         function(){ return ""; }
  //     ],
  //     {fontSize:15});

  // data.forEach(function(punto){ graficarPunto(punto) });
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
