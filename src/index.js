import commander from 'commander';

export default commander
  .version('1.0')
  .usage('gendiff [options] <first_config> <second_config>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format');
