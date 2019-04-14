import { __, apply, compose, filter, forEach } from 'ramda';
import { notNil } from 'ramda-extension';

/**
 * Chain multiple handlers and invoke each other with same params. Also filter nil handlers.
 *
 * @documented
 * @category Function
 * @param {Functions} handlers array of handlers
 * @param {*} args
 *
 */
const chainHandlers = (handlers) => (...args) => compose(
	forEach(apply(__, args)), filter(notNil))(handlers);

export default chainHandlers;