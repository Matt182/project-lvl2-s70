import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import { Map } from 'immutable';
import getParser from './parsers';

const UNCHANGED = 1;
const CHANGED = 2;
const DELETED = 3;
const ADDED = 4;
const OBJECT = 5;

const buildDifference = (before, after) => {
  const keys = _.union(_.keys(before), _.keys(after));
  const result = _.reduce(keys, (acc, key) => {
    if (_.isUndefined(before[key])) {
      return acc.set(key, {
        before: '',
        after: after[key],
        status: ADDED,
      });
    } else if (_.isUndefined(after[key])) {
      return acc.set(key, {
        before: before[key],
        after: '',
        status: DELETED,
      });
    } else if (before[key] === after[key]) {
      return acc.set(key, {
        before: before[key],
        after: after[key],
        status: UNCHANGED,
      });
    } else if (_.isObject(before[key])) {
      return acc.set(key, {
        children: buildDifference(before[key], after[key]),
        status: OBJECT,
      });
    }
    return acc.set(key, {
      before: before[key],
      after: after[key],
      status: CHANGED,
    });
  }, new Map({}));
  return result.toJS();
};

const getFileExt = file => path.extname(file).substr(1);

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

const makeOutputString = (difference, prefix = '  ', postfix = '') => {
  const message = _.keys(difference).reduce((acc, key) => {
    const result = acc;
    const value = difference[key];
    if (value.status === OBJECT) {
      return `${result}${prefix}${repeatSpace(2)}${key}: ${makeOutputString(value.children, prefix + repeatSpace(4), prefix + repeatSpace(2))}\n`;
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

export default (pathBefore, pathAfter) => {
  if (!fs.existsSync(pathBefore)) {
    throw new Error(`file ${pathBefore} doesn't exists`);
  }
  if (!fs.existsSync(pathAfter)) {
    throw new Error(`file ${pathAfter} doesn't exists`);
  }

  if (getFileExt(pathBefore) !== getFileExt(pathAfter)) {
    throw new Error('files formats are not consistent');
  }

  const format = getFileExt(pathBefore);
  const parse = getParser(format);

  const fileContentBefore = fs.readFileSync(pathBefore, 'utf8');
  const fileContentAfter = fs.readFileSync(pathAfter, 'utf8');

  const before = parse(fileContentBefore);
  const after = parse(fileContentAfter);

  const difference = buildDifference(before, after);
  const message = makeOutputString(difference);
  return message;
};
