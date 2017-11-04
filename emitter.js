'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;


class Emitter {
    constructor() {
        this.events = [];
    }

    on(event, context, handler) {
        this.events.push([event + '.', context, handler.bind(context)]);
    }

    off(event, context) {
        event += '.';
        this.events
            .map((item, index) => [item, index])
            .filter(elem => elem[0][0].startsWith(event) && elem[0][1] === context)
            .forEach(elem => delete this.events[elem[1]]);
    }

    static getNamespaces(path) {
        let last = '';
        let result = [];
        for (let part of path.split('.')) {
            last += part + '.';
            result.unshift(last);
        }

        return result;
    }

    emit(event) {
        Emitter.getNamespaces(event).forEach(e =>
            this.events
                .filter(x => x[0] === e)
                .forEach(x => x[2]())
        );
    }
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let emitter = new Emitter();
    let result = {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            emitter.on(event, context, handler);

            return result;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            emitter.off(event, context);

            return result;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            emitter.emit(event);

            return result;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            let severalHandler = () => times-- > 0 ? handler.bind(context)() : null;
            emitter.on(event, context, severalHandler);

            return result;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            let times = 0;
            let throughHandler = () => times++ % frequency ? null : handler.bind(context)();
            emitter.on(event, context, throughHandler);

            return result;
        }
    };

    return result;
}
