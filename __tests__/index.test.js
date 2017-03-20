import gendiff from '../src/';

const before = '/vagrant/project-lvl2-s70/__tests__/fixtures/before.fixture.json';
const after = '/vagrant/project-lvl2-s70/__tests__/fixtures/after.fixture.json';

const out = `{
  host: hexlet.io
+ timeout: 20
- timeout: 50
- proxy: 123.234.53.22
+ verbose: true
}`;

test('show correct difference', () => {
  expect(gendiff(before, after)).toBe(out);
});
