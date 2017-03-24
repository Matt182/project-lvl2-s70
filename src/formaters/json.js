import _ from 'lodash';
import { unchanged, changed, deleted, added, object } from '../';

const statusAsString = {
  [unchanged]: 'unchanged',
  [changed]: 'changed',
  [deleted]: 'deleted',
  [added]: 'added',
  [object]: 'object',
};

const prepare = (difference) => {
  const result = difference.reduce((acc, node) => {
    const accumulator = _.clone(acc);
    if (node.status === object) {
      accumulator[node.key] = prepare(node.children);
    } else {
      accumulator[node.key] = {
        before: node.before,
        after: node.after,
        status: statusAsString[node.status],
      };
    }
    return accumulator;
  }, {});
  return result;
};

const jsonFormater = (difference) => {
  const result = JSON.stringify(prepare(difference), null, 2);
  return result;
};

export default jsonFormater;
