import Yaml from 'js-yaml';
import Ini from 'ini';

const parseJson = string => JSON.parse(string);

const parseYaml = string => Yaml.load(string);

const parseIni = string => Ini.parse(string);

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
