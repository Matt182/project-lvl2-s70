import YAML from 'js-yaml';
import INI from 'ini';

const parseJson = file => JSON.parse(file);

const parseYaml = file => YAML.load(file);

const parseIni = file => INI.parse(file);

const parsers = {
  json: parseJson,
  yml: parseYaml,
  ini: parseIni,
};

export default (format) => {
  if (parsers[format]) {
    return parsers[format];
  }
  throw new Error('Parser not found');
};
