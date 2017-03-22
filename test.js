const assert   = require('assert');
const jfChrono = require('./index');
//------------------------------------------------------------------------------
// Inicio de las pruebas
//------------------------------------------------------------------------------
// Si no se especifican parámetros, se hacen igual a 0.
//------------------------------------------------------------------------------
let chrono = new jfChrono();
assert.equal(chrono.endTime, 0);
assert.equal(chrono.startTime, 0);
//------------------------------------------------------------------------------
// Si se especifican `now`, se usa el tiempo actual.
//------------------------------------------------------------------------------
chrono = new jfChrono('now');
assert.equal(chrono.endTime, 0);
assert.ok(new Date().getTime() - chrono.startTime < 100);
chrono = new jfChrono(0, 'now');
assert.equal(chrono.startTime, 0);
assert.ok(new Date().getTime() - chrono.endTime < 100);
//------------------------------------------------------------------------------
// Si se especifica una fecha válida, se debe asignar.
//------------------------------------------------------------------------------
chrono = new jfChrono('2017-01-01T00:00:00.000', '2017-01-01T12:34:56.000');
assert.equal(chrono.getTime(), 45296000);
//------------------------------------------------------------------------------
// El método toString debe colocar el tiempo transcurrido.
//------------------------------------------------------------------------------
chrono = new jfChrono('now', 'now');
chrono.endTime = chrono.startTime + 123;
assert.equal(chrono.toString(), '[class jfChrono(123)]');
//------------------------------------------------------------------------------
// Verificación de los métodos start y stop.
//------------------------------------------------------------------------------
chrono = new jfChrono('now');
chrono.start();
assert.ok(new Date().getTime() - chrono.startTime < 100);
assert.equal(chrono.endTime, 0);
chrono.stop();
assert.ok(new Date().getTime() - chrono.endTime < 100);
//------------------------------------------------------------------------------
// Verificamos la función de temporizador.
//------------------------------------------------------------------------------
chrono = new jfChrono();
assert.equal(chrono.__timer, null);
chrono.startTimer(1000);
assert.equal(typeof chrono.__timer, 'object');
chrono.stopTimer();
assert.equal(chrono.__timer, null);
//------------------------------------------------------------------------------
// Verificación de la factoría.
//------------------------------------------------------------------------------
chrono = jfChrono.create('test');
assert.ok(chrono instanceof jfChrono);
assert.equal(chrono, jfChrono.create('test'));
