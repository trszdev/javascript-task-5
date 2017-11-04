'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;


class Emitter {
    constructor() {
        this.root = {};
    }

    on(event, context, handler) {
        let node = this.traverse(event).pop();
        node['.'].push([context, handler]);
    }

    traverse(event) {
        let visited = [];
        event.split('.').reduce((acc, x) => {
            acc[x] = acc[x] || {};
            acc[x]['.'] = acc[x]['.'] || [];
            visited.push(acc[x]);

            return acc[x];
        }, this.root);

        return visited;
    }

    off(event, context) {
        let node = this.traverse(event).pop();
        for (let child of Object.keys(node).filter(x => x !== '.')) {
            delete node[child];
        }
        node['.'] = node['.'].filter(x => x[0] !== context);
    }

    emit(event) {
        let nodes = this.traverse(event).reverse();
        nodes.forEach(n => n['.'].forEach(
            ([context, handler]) => handler.bind(context)()
        ));
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
