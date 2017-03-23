#!/usr/bin/env node

import commander from 'commander';
import formatOutput from '../formater';
import gendiff from '../';

commander
  .version('1.5.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('<first_config> <second_config>')
  .action((firstConfig, secondConfig) => {
    try {
      const output = gendiff(firstConfig, secondConfig);
      const formated = formatOutput(output, commander.format);
      console.log(formated);
    } catch (e) {
      console.error(e.message);
    }
  })
  .parse(process.argv);
