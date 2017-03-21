#!/usr/bin/env node

import commander from 'commander';
import gendiff from '../';

commander
  .version('1.0.5')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('<first_config> <second_config>')
  .action((firstConfig, secondConfig) => {
    try {
      const output = gendiff(firstConfig, secondConfig);
      console.log(output);
    } catch (e) {
      console.error(e.message);
    }
  })
  .parse(process.argv);
