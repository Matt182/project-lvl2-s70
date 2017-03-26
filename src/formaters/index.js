import defaultFormater from './default';
import plainFormater from './plain';
import jsonFormater from './json';

const formaters = {
  json: jsonFormater,
  plain: plainFormater,
  default: defaultFormater,
};

const getFormater = format => formaters[format] || formaters.default;

export default format => getFormater(format);
