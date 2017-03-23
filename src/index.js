import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import { Map } from 'immutable';
import getParser from './parsers';

export const UNCHANGED = 1;
export const CHANGED = 2;
export const DELETED = 3;
export const ADDED = 4;
export const OBJECT = 5;

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
  return difference;
};
