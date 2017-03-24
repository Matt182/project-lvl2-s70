import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import { Map } from 'immutable';
import getParser from './parsers';

export const unchanged = 1;
export const changed = 2;
export const deleted = 3;
export const added = 4;
export const object = 5;

const buildDifference = (before, after) => {
  const keys = _.union(_.keys(before), _.keys(after));
  const result = _.reduce(keys, (acc, key) => {
    if (_.isUndefined(before[key])) {
      return [...acc,
        { key,
          before: '',
          after: after[key],
          status: added,
        }];
    } else if (_.isUndefined(after[key])) {
      return [...acc,
        { key,
          before: before[key],
          after: '',
          status: deleted,
        }];
    } else if (before[key] === after[key]) {
      return [...acc,
        {
          key,
          before: before[key],
          after: after[key],
          status: unchanged,
        }];
    } else if (_.isObject(before[key])) {
      return [...acc,
        { key,
          children: buildDifference(before[key], after[key]),
          status: object,
        }];
    }
    return [...acc,
      { key,
        before: before[key],
        after: after[key],
        status: changed,
      }];
  }, []);
  return result;
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
