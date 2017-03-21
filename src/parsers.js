import pYaml from 'js-yaml';

const parseJson = file => JSON.parse(file);

const parseYaml = file => pYaml.load(file);

const parsers = {
  json: parseJson,
  yml: parseYaml,
};

export default (format) => {
  if (parsers[format]) {
    return parsers[format];
  }
  throw new Error('Parser not found');
};
