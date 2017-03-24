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

const json = `{
  "common": {
    "setting1": {
      "before": "Value 1",
      "after": "Value 1",
      "status": "unchanged"
    },
    "setting2": {
      "before": "200",
      "after": "",
      "status": "deleted"
    },
    "setting3": {
      "before": true,
      "after": true,
      "status": "unchanged"
    },
    "setting6": {
      "before": {
        "key": "value"
      },
      "after": "",
      "status": "deleted"
    },
    "setting4": {
      "before": "",
      "after": "blah blah",
      "status": "added"
    },
    "setting5": {
      "before": "",
      "after": {
        "key5": "value5"
      },
      "status": "added"
    }
  },
  "group1": {
    "baz": {
      "before": "bas",
      "after": "bars",
      "status": "changed"
    },
    "foo": {
      "before": "bar",
      "after": "bar",
      "status": "unchanged"
    }
  },
  "group2": {
    "before": {
      "abc": "12345"
    },
    "after": "",
    "status": "deleted"
  },
  "group3": {
    "before": "",
    "after": {
      "fee": "100500"
    },
    "status": "added"
  }
}`;

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

test('show correct difference in json', () => {
  expect(formatOutput(gendiff(jsonBefore, jsonAfter), 'json')).toBe(json);
});

test('show correct difference in ini', () => {
  expect(formatOutput(gendiff(iniBefore, iniAfter), 'json')).toBe(json);
});
