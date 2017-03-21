import gendiff from '../src/';

const jsonBefore = '__tests__/fixtures/before.fixture.json';
const jsonAfter = '__tests__/fixtures/after.fixture.json';

const yamlBefore = '__tests__/fixtures/before.fixture.yml';
const yamlAfter = '__tests__/fixtures/after.fixture.yml';

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
