'use strict'

/*
APPROACH
1. Since each source is already sorted chronologically, we should map over all the source logs and add an index to each source's last log entry.

2. We should then pop each source giving the oldest log entry from each source and sort them based on date.

3. We should take the oldest entry from this list and print this out, noting it's index

4. We should then pop the oldest entry from that log source and add back to this list via binary search, since the list is already sorted
*/

// add index to each popped log entry
const addIndexToLastEntry = (logSource, index) => {
	const oldestEntry = logSource.pop();
	return oldestEntry ? Object.assign({}, oldestEntry, {index}) : null;
};

// binary search and merge
const mergeEntryIntoList = (oldestList, entry) => {
	if(!oldestList.length) return [entry]

	const entryDate = entry.date;
	let	end = oldestList.length-1,
			start = 0,
			mid = Math.floor(end/2),
			result;

	while(start < mid && mid < end) {
		const midEntryDate = oldestList[mid].date;
		if(entryDate <= midEntryDate) {
			start = mid;
			mid = Math.floor((end+start)/2);
		} else {
			end = mid;
			mid = Math.floor((end+start)/2);
		}
	}

	// NOTE: Usually indices will end up in format:
	// start: 1, mid: 1, end: 2  OR  start: 1, mid: 2, end: 2

	if(entryDate <= oldestList[end].date) {
		result = end+1;
	} else if(entryDate <= oldestList[start].date) {
		result = start+1;
	}

	if(result) {
		const newList = oldestList.slice(0,result).concat([entry]).concat(oldestList.slice(result));
		return newList;
	} else {
		const newList = [entry, ...oldestList];
		return newList;
	}
}

module.exports = (logSources, printer) => {
	// add indices to each log sources last entry and sort by date
	let oldestList =
	logSources.map(addIndexToLastEntry).sort((a,b) => b.date - a.date);

	while(oldestList.length) {

		const oldestEntry = oldestList.pop();
		if(oldestEntry) {
			printer.print(oldestEntry);

			const newEntryForList = addIndexToLastEntry(logSources[oldestEntry.index], oldestEntry.index);

			oldestList = newEntryForList ? mergeEntryIntoList(oldestList, newEntryForList) : oldestList;
		}
	}
	printer.done()
}

module.exports.mergeEntryIntoList = mergeEntryIntoList;
module.exports.addIndexToLastEntry = addIndexToLastEntry;
