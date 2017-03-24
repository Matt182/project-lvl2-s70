import _ from 'lodash';
import { changed, deleted, added, object } from '../';

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
  const result = difference.reduce((acc, node) => {
    if (node.status === deleted) {
      return `${acc}Property '${path}${node.key}' was removed\n`;
    }
    if (node.status === added) {
      return `${acc}Property '${path}${node.key}' was added with ${getPlainValue(node.after)}\n`;
    }
    if (node.status === changed) {
      return `${acc}Property '${path}${node.key}' was updated. ` +
        `From ${getPlainUpdated(node.before, node.after)}\n`;
    }
    if (node.status === object) {
      return `${acc}${plainFormater(node.children, `${path}${node.key}.`)}`;
    }
    return acc;
  }, '');
  return result;
};

export default plainFormater;
