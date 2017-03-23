import _ from 'lodash';
import { UNCHANGED, DELETED, ADDED, OBJECT } from '../';

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
  const message = _.keys(difference).reduce((acc, key) => {
    const result = acc;
    const value = difference[key];
    if (value.status === OBJECT) {
      return `${result}${prefix}${repeatSpace(2)}${key}: ${defaultFormater(value.children, prefix + repeatSpace(4), prefix + repeatSpace(2))}\n`;
    }
    if (value.status === UNCHANGED) {
      return `${result}${prefix}${repeatSpace(2)}${key}: ${value.after}\n`;
    }
    if (value.status === ADDED) {
      return `${result}${prefix}+ ${key}: ${makeMessageDefault(value.after, prefix + repeatSpace(2))}\n`;
    }
    if (value.status === DELETED) {
      return `${result}${prefix}- ${key}: ${makeMessageDefault(value.before, prefix + repeatSpace(2))}\n`;
    }
    return `${result}${prefix}+ ${key}: ${makeMessageDefault(value.after, prefix + repeatSpace(2))}\n` +
    `${prefix}- ${key}: ${makeMessageDefault(value.before, prefix + repeatSpace(2))}\n`;
  }, '');
  return `{\n${message}${postfix}}`;
};

export default defaultFormater;
