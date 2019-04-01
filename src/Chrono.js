/**
 * Listado de cronómetros usados de manera global mediante la llamada a `jf.Chrono::factory`.
 *
 * @type {Object}
 */
const chronos = {};
/**
 * Clase de utilidad que permite manejar intervalos de tiempos.
 *
 * @namespace jf
 * @class     jf.Chrono
 */
module.exports = class jfChrono
{
    /**
     * Construye la instancia usando los valores especificados.
     *
     * @method constructor
     *
     * @param {Number|String?} startTime Tiempo inicial. Si es `now` se usa el tiempo actual.
     * @param {Number|String?} endTime   Tiempo final. Si es `now` se usa el tiempo actual.
     *
     * @constructor
     */
    constructor(startTime = 0, endTime = 0)
    {
        /**
         * Tiempo de finalización.
         *
         * @property endTime
         * @type     {Number}
         */
        this.endTime = 0;
        /**
         * Tiempo de inicio.
         *
         * @property startTime
         * @type     {Number}
         */
        this.startTime = 0;
        /**
         * ID del temporizador.
         *
         * @property _time
         * @type     {Number|Object}
         * @private
         */
        this.__timer = null;
        //------------------------------------------------------------------------------
        this.setTime('startTime', startTime);
        this.setTime('endTime', endTime);
    }

    /**
     * Devuelve el tiempo trascurrido en milisegundos.
     *
     * @method getTime
     *
     * @return {Number}
     */
    getTime()
    {
        let _endTime = this.endTime;
        if (_endTime === 0)
        {
            _endTime = new Date().getTime();
        }

        return _endTime - this.startTime;
    }

    /**
     * Empieza a contar de nuevo el cronómetro.
     *
     * @method reset
     */
    reset()
    {
        this.stopTimer();
        this.setTime('endTime', 0);
        this.setTime('startTime', 0);
    }

    /**
     * Inicializa una de las propiedades que almacena el tiempo.
     *
     * @method setTime
     *
     * @param {String}        name  Nombre de la propiedad a inicializar.
     * @param {Number|String} value Valor a asignar. Se puede usar `now` para usar el tiempo actual.
     */
    setTime(name, value)
    {
        if (value)
        {
            switch (typeof value)
            {
                case 'number':
                    this[name] = value;
                    break;
                case 'string':
                    if (value === 'now')
                    {
                        this[name] = new Date().getTime();
                    }
                    else
                    {
                        let _time = Date.parse(value);
                        if (!isNaN(_time))
                        {
                            this[name] = _time;
                        }
                    }
                    break;
            }
        }
    }

    /**
     * Empieza a contar de nuevo el cronómetro.
     *
     * @method start
     */
    start()
    {
        this.reset();
        this.setTime('startTime', 'now');
    }

    /**
     * Ejecuta un temporizador y llama al callback especificado cada vez
     * que se termina el tiempo.
     * Cuando se quiera detener el temporizador se debe llamar al método `stopTimer`.
     *
     * @method startTimer
     *
     * @param {Number}   interval Intervalo en milisegundos que se llamará el callback (1000 por defecto).
     * @param {Function} cb       Callback que se llamará cada vez que se agote el intervalo de tiempo especificado.
     */
    startTimer(interval = 1000, cb)
    {
        const _isFunction = typeof cb === 'function';
        this.__timer      = setInterval(
            () =>
            {
                this.setTime('endTime', 'now');
                if (_isFunction)
                {
                    cb(this);
                }
            },
            interval
        );
    }

    /**
     * Detiene el cronómetro.
     *
     * @method stop
     */
    stop()
    {
        this.stopTimer();
        this.setTime('endTime', 'now');
    }

    /**
     * Detiene el temporizador, si se está usando.
     *
     * @method stopTimer
     */
    stopTimer()
    {
        const _timer = this.__timer;
        if (_timer !== null)
        {
            clearInterval(_timer);
            this.__timer = null;
        }
    }

    /**
     * @method toString
     *
     * @override
     */
    toString()
    {
        return `[class ${this.constructor.name}(${this.getTime()})]`;
    }

    /**
     * Crea una instancia de la clase y le asigna el nombre especificado.
     * Si la instancia ya existe, se devuelve la instancia existente.
     *
     * @method create
     *
     * @param {String}         name      Nombre del cronómetro.
     * @param {Number|String?} startTime Tiempo inicial. Si es `now` se usa el tiempo actual.
     * @param {Number|String?} endTime   Tiempo final. Si es `now` se usa el tiempo actual.
     *
     * @return {jf.Chrono|undefined} Instancia que corresponde con el nombre especificado.
     *
     * @static
     */
    static create(name, startTime = 0, endTime = 0)
    {
        let _result;
        if (name && typeof name === 'string')
        {
            if (!(name in chronos))
            {
                chronos[name] = new jfChrono(startTime, endTime);
            }
            _result = chronos[name];
        }

        return _result;
    }

    /**
     * Elimina un cronómetro de la lista.
     *
     * @method delete
     *
     * @param {String} name Nombre del cronómetro.
     *
     * @static
     */
    static delete(name)
    {
        delete chronos[name];
    }
};
