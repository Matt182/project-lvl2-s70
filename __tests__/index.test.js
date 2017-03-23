import gendiff from '../src/';
import formatOutput from '../src/formater';

const jsonBefore = '__tests__/fixtures/before.fixture.json';
const jsonAfter = '__tests__/fixtures/after.fixture.json';

const yamlBefore = '__tests__/fixtures/before.fixture.yml';
const yamlAfter = '__tests__/fixtures/after.fixture.yml';

const iniBefore = '__tests__/fixtures/before.fixture.ini';
const iniAfter = '__tests__/fixtures/after.fixture.ini';

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

const plain = `Property 'common.setting2' was removed
Property 'common.setting6' was removed
Property 'common.setting4' was added with value: blah blah
Property 'common.setting5' was added with complex value
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group2' was removed
Property 'group3' was added with complex value
`;

test('show correct difference in json', () => {
  expect(formatOutput(gendiff(jsonBefore, jsonAfter))).toBe(complexOut);
});

test('show correct difference in yaml', () => {
  expect(formatOutput(gendiff(yamlBefore, yamlAfter))).toBe(complexOut);
});

test('show correct difference in ini', () => {
  expect(formatOutput(gendiff(iniBefore, iniAfter))).toBe(complexOut);
});

test('show correct difference in json', () => {
  expect(formatOutput(gendiff(jsonBefore, jsonAfter), 'plain')).toBe(plain);
});

test('show correct difference in yaml', () => {
  expect(formatOutput(gendiff(yamlBefore, yamlAfter), 'plain')).toBe(plain);
});

test('show correct difference in ini', () => {
  expect(formatOutput(gendiff(iniBefore, iniAfter), 'plain')).toBe(plain);
});
