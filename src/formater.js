import defaultFormater from './formaters/default';
import plainFormater from './formaters/plain';

const getFormater = (format) => {
  if (format === 'plain') {
    return plainFormater;
  }
  return defaultFormater;
};

export default (output, format) => {
  const formater = getFormater(format);
  return formater(output);
};
