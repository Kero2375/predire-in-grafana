import App from './App';

test('should convert CSV data into DataPoint array', () => {
  const text = '1, 2 \n 3, 4';
  const result = [[1, 2], [3, 4]];
  expect(App.parseCSV(text)).toEqual(expect.arrayContaining(result));
});
