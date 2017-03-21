import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import getParser from './parsers';

const UNCHANGED = 1;
const CHANGED = 2;
const DELETED = 3;
const ADDED = 4;

const findDifference = (before, after) => {
  const part = _.transform(before, (result, value, key) => {
    const item = result;
    item[key] = {
      before: value,
      after: '',
      status: DELETED,
    };
    return item;
  }, {});

  const difference = _.transform(after, (result, value, key) => {
    const item = result;
    if (_.has(item, key)) {
      item[key].after = value;
      item[key].status = item[key].after === item[key].before ? UNCHANGED : CHANGED;
    } else {
      item[key] = {
        before: '',
        after: value,
        status: ADDED,
      };
    }
    return item;
  }, part);

  return difference;
};

const getFileExt = file => path.extname(file).substr(1);

const makeMessage = (difference) => {
  const message = Object.keys(difference).reduce((acc, key) => {
    const result = acc;
    const value = difference[key];
    if (value.status === UNCHANGED) {
      return `${result}  ${key}: ${value.before}\n`;
    }
    if (value.status === ADDED) {
      return `${result}+ ${key}: ${value.after}\n`;
    }
    if (value.status === DELETED) {
      return `${result}- ${key}: ${value.before}\n`;
    }
    return `${result}+ ${key}: ${value.after}\n- ${key}: ${value.before}\n`;
  }, '{\n');
  return `${message}}`;
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
  const parser = getParser(format);

  const fileBefore = fs.readFileSync(pathBefore);
  const fileAfter = fs.readFileSync(pathAfter);

  const before = parser(fileBefore);
  const after = parser(fileAfter);

  const difference = findDifference(before, after);
  const message = makeMessage(difference);
  return message;
};
