function sortByDesc(unsorted)
{
    // Convert the object to an array of key-value pairs
    let entries = Object.entries(unsorted);

    // Sort the array by the values in descending order
    entries.sort((a, b) => b[1] - a[1]);

    // Convert the sorted array back to an object (optional)
    return Object.fromEntries(entries);


}

export { sortByDesc }