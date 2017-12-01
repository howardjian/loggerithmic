'use strict'

const { mergeEntryIntoList } = require('./sync-sorted-merge');
// same approach as sync-sorted-merge but use ES7's async / await + Promises

const addIndexToLastEntryAsync = async (logSource, index) => {
	const oldestEntry = await logSource.popAsync().catch(console.error);
	return oldestEntry ? Object.assign({}, oldestEntry, {index}) : null;
};

module.exports = async (logSources, printer) => {
	let oldestListAsync = await Promise.all(logSources.map(addIndexToLastEntryAsync))
	.catch(console.error);
	oldestListAsync.sort((a,b) => b.date - a.date);

	while(oldestListAsync.length) {
		const oldestEntry = oldestListAsync.pop();
		if(oldestEntry) {
			printer.print(oldestEntry);

			const newEntryForList = await addIndexToLastEntryAsync(logSources[oldestEntry.index], oldestEntry.index).catch(console.error);

			oldestListAsync = newEntryForList
			?
			mergeEntryIntoList(oldestListAsync, newEntryForList)
			: oldestListAsync;
		}
	}
	printer.done()
}

module.exports.addIndexToLastEntryAsync = addIndexToLastEntryAsync;
