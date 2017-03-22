# jfChrono [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Simple class for using chronometers and timers in applications.

## Usage

[![npm install jfChrono](https://nodei.co/npm/jf-chrono.png?compact=true)](https://npmjs.org/package/jf-chrono/)

### Examples

#### Getting AJAX request time for stats

```js
const jfChrono = require('jf-chrono');
const chrono = new jfChrono();
ajax.on(
    'end', 
    () => {
        chrono.stop();
        console.log('Request time (ms): %d', chrono.getTime())
    }
);
chrono.start();
ajax.doRequest();
```

#### Timers

Timer can be stopped and resumed using methods `startTimer` and `stopTimer`.

```js
const jfChrono = require('jf-chrono');
let count      = 1;
function timer()
{
    console.log('Doing action %s', count);
    chrono.startTimer(
        1000, 
        (chrono) => {
            const _time = chrono.getTime();
            // 5s 
            if (_time > 5000)
            {
                onEndTimer(chrono);
            }
        }
    );
}
function onEndTimer(chrono)
{
    chrono.stopTimer();
    if (++count < 5)
    {
        timer();        
    }
    else
    {
        console.log('Total time: %d', chrono.getTime());
    }
}
const chrono = new jfChrono();
chrono.start();
timer();
```

#### Timing actions

You can use several timers if you want to create reports of all actions taken.

```js
function showStats()
{
    console.log('Parsing time: %d', jfChrono.create('parse').getTime());
    console.log('Analyzing time: %d', jfChrono.create('analyze').getTime());
    console.log('Reporting time: %d', jfChrono.create('report').getTime());
    console.log('Total time: %d', jfChrono.create('process').getTime());
}
const jfChrono = require('jf-chrono');
jfChrono.create('process').start();
// Preparing actions
jfChrono.create('parse').start();
// Parse files
// ...
// ...
jfChrono.create('parse').stop();
jfChrono.create('analyze').start();
// Analyze files
// ...
// ...
jfChrono.create('analyze').stop();
jfChrono.create('report').start();
// Creating reports
// ...
// ...
jfChrono.create('report').stop();
jfChrono.create('process').stop();
// ...
showStats();
```
