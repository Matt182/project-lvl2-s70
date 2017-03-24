import _ from 'lodash';
import { unchanged, deleted, added, object } from '../';

const repeatSpace = times => ' '.repeat(times);

const makeMessageDefault = (structure, prefix) => {
  let result = '';
  if (_.isObject(structure)) {
    result = _.keys(structure).reduce((acc, key) => {
      const line = `${acc}${prefix}${repeatSpace(4)}${key}: ${makeMessageDefault(structure[key], prefix + repeatSpace(2))}\n`;
      return line;
    }, '{\n');
    result = `${result}${prefix}}`;
  } else {
    result = `${structure}`;
  }
  return result;
};

const defaultFormater = (difference, prefix = '  ', postfix = '') => {
  const message = difference.reduce((acc, node) => {
    const result = acc;
    if (node.status === object) {
      return `${result}${prefix}${repeatSpace(2)}${node.key}: ${defaultFormater(node.children, prefix + repeatSpace(4), prefix + repeatSpace(2))}\n`;
    }
    if (node.status === unchanged) {
      return `${result}${prefix}${repeatSpace(2)}${node.key}: ${node.after}\n`;
    }
    if (node.status === added) {
      return `${result}${prefix}+ ${node.key}: ${makeMessageDefault(node.after, prefix + repeatSpace(2))}\n`;
    }
    if (node.status === deleted) {
      return `${result}${prefix}- ${node.key}: ${makeMessageDefault(node.before, prefix + repeatSpace(2))}\n`;
    }
    return `${result}${prefix}+ ${node.key}: ${makeMessageDefault(node.after, prefix + repeatSpace(2))}\n` +
    `${prefix}- ${node.key}: ${makeMessageDefault(node.before, prefix + repeatSpace(2))}\n`;
  }, '');
  return `{\n${message}${postfix}}`;
};

export default defaultFormater;
