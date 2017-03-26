import _ from 'lodash';
import { object } from '../';


const prepare = (difference) => {
  const result = difference.reduce((acc, node) => {
    const accumulator = _.clone(acc);
    if (node.status === object) {
      accumulator[node.key] = prepare(node.children);
    } else {
      accumulator[node.key] = {
        before: node.before,
        after: node.after,
        status: node.status,
      };
    }
    return accumulator;
  }, {});
  return result;
};

const jsonFormater = difference => JSON.stringify(prepare(difference), null, 2);

export default jsonFormater;
