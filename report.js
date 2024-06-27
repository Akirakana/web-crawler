import { sortByDesc } from "./sort.js";

function printReport(pages)
{
    console.log('Printing report...');
    let sorted = sortByDesc(pages);

    for (let url in sorted) {
        console.log(`Found ${sorted[url]} internal links to ${url}`);
    }
    console.log(sorted);
}

export { printReport }