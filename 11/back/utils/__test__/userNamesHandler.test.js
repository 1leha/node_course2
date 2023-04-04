const userNamesHandler = require('../userNamesHandler');

const testingData = [
  { input: 'Jimi Hendrix', output: 'Jimi Hendrix' },
  { input: 'jimi hendrix', output: 'Jimi Hendrix' },
  { input: 'jimi Hendrix', output: 'Jimi Hendrix' },
  { input: '   Jimi  hendriX ', output: 'Jimi Hendrix' },
  { input: 'Jimi_Hendrix', output: 'Jimi Hendrix' },
  { input: 'jimi.hendrix', output: 'Jimi Hendrix' },
  { input: 'jimi@hend@rix', output: 'Jimi Hend Rix' },
  { input: '_jimi * hendrix', output: 'Jimi Hendrix' },
  { input: 'jimi hèndrix__', output: 'Jimi Hendrix' },
  { input: 'jimi中村hèndrix__', output: 'Jimi Hendrix' },
  { input: 'jimi de Hèndrix__', output: 'Jimi De Hendrix' },
  { input: '中村哲二', output: '' },
  { input: undefined, output: '' },
  { input: null, output: '' },
  { input: true, output: '' },
];

// const calc = (x, y) => x + y;

describe('User names handler function tests', () => {
  // test('Test calc sum 2 + 2', () => {
  //   expect(calc(2, 2)).toBe(4);
  // });

  // test('Test calc sum 3 + 3', () => {
  //   expect(calc(3, 3)).toBe(5);
  // });

  test('Test jimi hendrix', () => {
    expect(userNamesHandler('jimi hendrix')).toBe('Jimi Hendrix');
  });

  test('Test passed names', () => {
    for (const item of testingData) {
      const normalizedName = userNamesHandler(item.input);

      expect(normalizedName).toBe(item.output);
    }
  });
});
