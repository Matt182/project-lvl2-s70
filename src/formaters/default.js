import _ from 'lodash';
import { unchanged, deleted, added, object } from '../';

const repeatSpace = times => ' '.repeat(times);

const makeMessageDefault = (structure, prefix) => {
  let result = '';
  if (_.isObject(structure)) {
    result = _.keys(structure).reduce((acc, key) => {
      const line = `${acc}${repeatSpace(prefix)}${repeatSpace(4)}${key}: ${makeMessageDefault(structure[key], prefix + 2)}\n`;
      return line;
    }, '{\n');
    result = `${result}${repeatSpace(prefix)}}`;
  } else {
    result = `${structure}`;
  }
  return result;
};

const defaultFormater = (difference, prefix = 2, postfix = 0) => {
  const message = difference.reduce((acc, node) => {
    const result = acc;
    if (node.status === object) {
      return `${result}${repeatSpace(prefix)}${repeatSpace(2)}${node.key}: ${defaultFormater(node.children, prefix + 4, prefix + 2)}\n`;
    }
    if (node.status === unchanged) {
      return `${result}${repeatSpace(prefix)}${repeatSpace(2)}${node.key}: ${node.after}\n`;
    }
    if (node.status === added) {
      return `${result}${repeatSpace(prefix)}+ ${node.key}: ${makeMessageDefault(node.after, prefix + 2)}\n`;
    }
    if (node.status === deleted) {
      return `${result}${repeatSpace(prefix)}- ${node.key}: ${makeMessageDefault(node.before, prefix + 2)}\n`;
    }
    return `${result}${repeatSpace(prefix)}+ ${node.key}: ${makeMessageDefault(node.after, prefix + 2)}\n` +
    `${repeatSpace(prefix)}- ${node.key}: ${makeMessageDefault(node.before, prefix + 2)}\n`;
  }, '');
  return `{\n${message}${repeatSpace(postfix)}}`;
};

export default defaultFormater;
