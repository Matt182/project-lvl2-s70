import _ from 'lodash';
import { CHANGED, DELETED, ADDED, OBJECT } from '../';

const getPlainValue = (value) => {
  if (_.isObject(value)) {
    return 'complex value';
  }
  return `value: ${value}`;
};

const getPlainUpdated = (before, after) => {
  const result = `${_.isObject(before) ? 'complex value' : `'${before}'`} ` +
    `to ${_.isObject(after) ? 'complex value' : `'${after}'`}`;
  return result;
};

const plainFormater = (difference, path = '') => {
  const result = _.keys(difference).reduce((acc, key) => {
    if (difference[key].status === DELETED) {
      return `${acc}Property '${path}${key}' was removed\n`;
    }
    if (difference[key].status === ADDED) {
      return `${acc}Property '${path}${key}' was added with ${getPlainValue(difference[key].after)}\n`;
    }
    if (difference[key].status === CHANGED) {
      return `${acc}Property '${path}${key}' was updated. ` +
        `From ${getPlainUpdated(difference[key].before, difference[key].after)}\n`;
    }
    if (difference[key].status === OBJECT) {
      return `${acc}${plainFormater(difference[key].children, `${path}${key}.`)}`;
    }
    return acc;
  }, '');
  return result;
};

export default plainFormater;
