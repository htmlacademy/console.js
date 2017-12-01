import AbstractView from './abstract-view';
import {getElement} from './utils';

export default class TypeView extends AbstractView {
  constructor(value, type, isPrimitive) {
    super();
    this._value = value;
    this._type = type;
    this._isPrimitive = isPrimitive;
  }

  get value() {
    return this._value;
  }

  get type() {
    return this._type;
  }

  get isPrimitive() {
    return this._isPrimitive;
  }
}
