#!/usr/bin/env node

import commander from 'commander';

commander
  .version('1.0.4')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('<first_config> <second_config>')
  .parse(process.argv);
