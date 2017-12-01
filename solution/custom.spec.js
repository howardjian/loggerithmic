import test from 'ava';
const P = require('bluebird');
const { addIndexToLastEntry, mergeEntryIntoList } = require('./sync-sorted-merge');
const { addIndexToLastEntryAsync } = require('./async-sorted-merge');


const logSource = function (date) {
  this.arr = [];
  if(date) {
    this.arr.push({date});
  }
}
const newDate = new Date(Date.now() - 1200);
const newDate1 = new Date(Date.now()-1000);
const newDate2 = new Date(Date.now()-750);
const newDate3 = new Date(Date.now()-500);
const newDate4 = new Date(Date.now()-100);

logSource.prototype.pop = function() {
  return this.arr.pop();
}

logSource.prototype.popAsync = function() {
  return P.delay(Math.floor(Math.random()*5)).then(() => this.arr.pop());
}


test('Synchronously adds an index to the last entry from each source', t => {
  const dummyLogSource = new logSource(newDate);

  const expected = Object.assign({date: newDate}, {index: 1});
  const test = addIndexToLastEntry(dummyLogSource, 1);

  t.deepEqual(test, expected)
})

test('Should return null if nothing to pop', t => {
  const dummyLogSource = new logSource();
  t.falsy(dummyLogSource.pop())
})

test('Asynchronously adds an index to the last entry from each source', async t => {
  const dummyLogSource = new logSource(newDate);
  const expected = Object.assign({date: newDate}, {index: 2});

  const test = await addIndexToLastEntryAsync(dummyLogSource, 2);

  t.deepEqual(test, expected);
})

test('Should return null if nothing to popAsync', async t => {
  const dummyLogSource = new logSource();
  t.falsy(await dummyLogSource.popAsync())
})


test('Should merge an item correctly in an empty List', t => {
  const testList = [];
  const testEntry = {date: newDate};

  const test = mergeEntryIntoList(testList, testEntry);
  const expected = [testEntry];

  t.deepEqual(test, expected);
})

test('Should merge an item correctly in a single-item List', t => {
  const testList = [{date: newDate1}]
  const testDate = new Date(newDate2 - 100);
  const testEntry = {date: testDate}

  const test = mergeEntryIntoList(testList, testEntry);
  const expected = [...testList, testEntry].sort((a,b) => b.date - a.date);

  t.deepEqual(test, expected);
})

test('Should merge an item correctly in an even List', t => {
  const testList = [newDate4, newDate3, newDate2, newDate1].map(date => {
    return {date}
  });
  const testDate = new Date(newDate2 - 100);
  const testEntry = {date: testDate}

  const test = mergeEntryIntoList(testList, testEntry);
  const expected = [...testList, testEntry].sort((a,b) => b.date - a.date);

  t.deepEqual(test, expected);
})

test('Should merge an item correctly in an odd List', t => {
  const testList = [newDate4, newDate3, newDate2, newDate1, newDate].map(date => {
    return {date}
  });
  const testDate = new Date(newDate2 - 100);
  const testEntry = {date: testDate}

  const test = mergeEntryIntoList(testList, testEntry);
  const expected = [...testList, testEntry].sort((a,b) => b.date - a.date);

  t.deepEqual(test, expected);
})

test('Should merge an item correctly if it falls in the beginning of the list', t => {
  const testList = [newDate4, newDate3, newDate2, newDate1].map(date => {
    return {date}
  });
  const testDate = new Date(Date.now());
  const testEntry = {date: testDate};

  const test = mergeEntryIntoList(testList, testEntry);
  const expected = [...testList, testEntry].sort((a,b) => b.date - a.date);

  t.deepEqual(test, expected);
})

test('Should merge an item correctly if it falls at the end of the list', t => {
  const testList = [newDate4, newDate3, newDate2, newDate1].map(date => {
    return {date}
  });
  const testDate = new Date(newDate4 - 1000);
  const testEntry = {date: testDate};

  const test = mergeEntryIntoList(testList, testEntry);
  const expected = [...testList, testEntry].sort((a,b) => b.date - a.date);

  t.deepEqual(test, expected);
})
