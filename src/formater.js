import defaultFormater from './formaters/default';
import plainFormater from './formaters/plain';
import jsonFormater from './formaters/json';

const getFormater = (format) => {
  if (format === 'plain') {
    return plainFormater;
  }
  if (format === 'json') {
    return jsonFormater;
  }
  return defaultFormater;
};

export default (output, format) => {
  const formater = getFormater(format);
  return formater(output);
};
