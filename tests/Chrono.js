const jfChrono    = require('../src/Chrono');
const jfTestsUnit = require('@jf/tests/src/type/Unit');
/**
 * Pruebas unitarias de la clase `jf.Chrono`.
 */
module.exports = class jfChronoTest extends jfTestsUnit
{
    /**
     * @override
     */
    static get title()
    {
        return 'jf.Chrono';
    }

    /**
     * Comprueba la definición de la clase.
     */
    testDefinition()
    {
        this._testDefinition(
            jfChrono,
            null,
            {
                endTime   : 0,
                startTime : 0,
                __timer   : null
            }
        );
    }

    /**
     * Pruebas del método `constructor`.
     */
    testConstructor()
    {
        let _sut = new jfChrono();
        this.assertEqual(_sut.endTime, 0);
        this.assertEqual(_sut.startTime, 0);
        //------------------------------------------------------------------------------
        // Si se especifican `now`, se usa el tiempo actual.
        //------------------------------------------------------------------------------
        _sut = new jfChrono('now');
        this.assertEqual(_sut.endTime, 0);
        this.assertTrue(new Date().getTime() - _sut.startTime < 100);
        _sut = new jfChrono(0, 'now');
        this.assertEqual(_sut.startTime, 0);
        this.assertTrue(new Date().getTime() - _sut.endTime < 100);
        //------------------------------------------------------------------------------
        // Si se especifica una fecha válida, se debe asignar.
        //------------------------------------------------------------------------------
        _sut = new jfChrono('2017-01-01T00:00:00.000', '2017-01-01T12:34:56.000');
        this.assertEqual(_sut.getTime(), 45296000);
    }

    /**
     * Pruebas del método `getTime`.
     */
    testGetTime()
    {
        const _date = new Date();
        const _sut  = new jfChrono(_date.getTime());
        this.assertTrue(_sut.getTime() < 100);
    }

    /**
     * Pruebas del método `reset`.
     */
    testReset()
    {
        const _sut   = new jfChrono(Date.now(), Date.now());
        this.assertEqual(_sut.__timer, null);
        this.assertTrue(_sut.startTime !== 0);
        this.assertTrue(_sut.endTime !== 0);
        _sut.startTimer(5000);
        this.assertTrue(_sut.__timer !== null);
        _sut.reset();
        this.assertEqual(_sut.__timer, null);
        this.assertTrue(_sut.startTime !== 0);
        this.assertTrue(_sut.endTime !== 0);
    }

    /**
     * Pruebas del método `setTime`.
     */
    testSetTime()
    {
        const _sut = new jfChrono();
        let _value = Math.random();
        _sut.setTime('startTime', _value);
        this.assertEqual(_sut.startTime, _value);
        this.constructor.getAllTypes()
            .filter(value => typeof value !== 'number' && typeof value !== 'string')
            .forEach(
                value =>
                {
                    // Los valores inválidos se descartan así que debe retener el último valor.
                    _sut.setTime('startTime', value);
                    this.assertEqual(_sut.startTime, _value);
                }
            );
        const _date = new Date();
        _sut.setTime('startTime', _date.toISOString());
        this.assertEqual(_sut.startTime, _date.getTime());
        // Un text incorrecto se converite en NaN y no actualiza el valor.
        _sut.setTime('startTime', 'abcdef');
        this.assertEqual(_sut.startTime, _date.getTime());
    }

    /**
     * Pruebas del método `start`.
     */
    testStartStop()
    {
        const _sut = new jfChrono('now');
        _sut.start();
        this.assertTrue(new Date().getTime() - _sut.startTime < 100);
        this.assertEqual(_sut.endTime, 0);
        _sut.stop();
        this.assertTrue(new Date().getTime() - _sut.endTime < 100);
    }

    /**
     * Pruebas del método `startTimer`.
     */
    async testStartTimer()
    {
        let _args    = null;
        const _ms    = 100;
        const _sut   = new jfChrono();
        _sut.setTime = function (...args)
        {
            _args = args;
        };
        this.assertEqual(_sut.__timer, null);
        _sut.startTimer(_ms);
        await this.sleep(_ms * 2);
        this._assert('', _args, ['endTime', 'now']);
        _sut.stopTimer();
    }

    /**
     * Pruebas del método `startTimer`.
     */
    async testStartTimerNoParams()
    {
        let _args    = null;
        const _ms    = 600;
        const _sut   = new jfChrono();
        _sut.setTime = function (...args)
        {
            _args = args;
        };
        this.assertEqual(_sut.__timer, null);
        _sut.startTimer();
        await this.sleep(_ms);
        this.assertNull(_args);
        await this.sleep(_ms);
        this._assert('', _args, ['endTime', 'now']);
        _sut.stopTimer();
    }

    /**
     * Pruebas del método `startTimer` usando un callback.
     */
    async testStartTimerCallback()
    {
        let _args    = null;
        let _args2   = null;
        const _cb    = (...args) => _args2 = args;
        const _ms    = 100;
        const _sut   = new jfChrono();
        _sut.setTime = function (...args)
        {
            _args = args;
        };
        this.assertEqual(_sut.__timer, null);
        _sut.startTimer(_ms, _cb);
        await this.sleep(_ms * 2);
        this._assert('', _args, ['endTime', 'now']);
        this._assert('', _args2, [_sut]);
        _sut.stopTimer();
    }

    /**
     * Pruebas de los métodos estáticos `create` y `delete`.
     */
    testStaticCreateDelete()
    {
        const _name = Date.now().toString();
        const _sut  = jfChrono.create(_name);
        this.assertTrue(_sut instanceof jfChrono);
        let _sut2 = jfChrono.create(_name);
        this.assertTrue(_sut === _sut2);
        jfChrono.delete(_name);
        _sut2 = jfChrono.create(_name);
        this.assertTrue(_sut !== _sut2);
        //------------------------------------------------------------------------------
        // Valores inválidos.
        //------------------------------------------------------------------------------
        this.constructor.getAllTypes()
            .filter(value => typeof value !== 'string')
            .forEach(value => this.assertUndefined(jfChrono.create(value)));
    }

    /**
     * Pruebas del método `stopTimer`.
     */
    testStopTimer()
    {
        const _sut = new jfChrono();
        this.assertEqual(_sut.__timer, null);
        _sut.startTimer(1000);
        this.assertEqual(typeof _sut.__timer, 'object');
        _sut.stopTimer();
        this.assertEqual(_sut.__timer, null);
    }

    /**
     * Pruebas del método `toString`.
     */
    testToString()
    {
        const _sut   = new jfChrono('now', 'now');
        _sut.endTime = _sut.startTime + 123;
        this.assertEqual(_sut.toString(), '[class jfChrono(123)]');
    }
};
