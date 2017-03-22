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

const complexOut = `{
  common: {
    setting1: Value 1
  - setting2: 200
    setting3: true
  - setting6: {
      key: value
    }
  + setting4: blah blah
  + setting5: {
      key5: value5
    }
  }
  group1: {
  + baz: bars
  - baz: bas
    foo: bar
  }
- group2: {
    abc: 12345
  }
+ group3: {
    fee: 100500
  }
}`;

test('show correct difference in json', () => {
  expect(gendiff(jsonBefore, jsonAfter)).toBe(complexOut);
});

test('show correct difference in yaml', () => {
  expect(gendiff(yamlBefore, yamlAfter)).toBe(complexOut);
});

test('show correct difference in ini', () => {
  expect(gendiff(iniBefore, iniAfter)).toBe(complexOut);
});
