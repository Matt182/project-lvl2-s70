import gendiff from '../src/';

const jsonBefore = '__tests__/fixtures/before.fixture.json';
const jsonAfter = '__tests__/fixtures/after.fixture.json';

const yamlBefore = '__tests__/fixtures/before.fixture.yml';
const yamlAfter = '__tests__/fixtures/after.fixture.yml';

const iniBefore = '__tests__/fixtures/before.fixture.ini';
const iniAfter = '__tests__/fixtures/after.fixture.ini';

const out = `{
  host: hexlet.io
+ timeout: 20
- timeout: 50
- proxy: 123.234.53.22
+ verbose: true
}`;

test('show correct difference in json', () => {
  expect(gendiff(jsonBefore, jsonAfter)).toBe(out);
});

test('show correct difference in yaml', () => {
  expect(gendiff(yamlBefore, yamlAfter)).toBe(out);
});

test('show correct difference in ini', () => {
  expect(gendiff(iniBefore, iniAfter)).toBe(out);
});
