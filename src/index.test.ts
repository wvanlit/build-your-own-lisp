import { interpret, version } from './index';

describe('Project', () => {
  test('is operational', () => {
    expect(true).toBe(true);
  });

  test('version is defined', () => {
    expect(version).toBeDefined();
  });
});

describe.skip('Interpreter', () => {
  test('can do simple expression evaluation', () => {
    expect(interpret('(+ 1 2 3)')).toBe(6);
  });
});
