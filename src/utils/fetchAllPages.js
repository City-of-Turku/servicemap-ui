/**
 * Fetches a DRF-paginated ("count"/"next"/"results") endpoint and recursively follows
 * the "next" link until all pages have been retrieved, combining their results.
 * This prevents silent data loss when the result count exceeds a single page_size.
 * Logs a warning if the combined results still do not match the reported count,
 * so pagination/API issues surface instead of causing missing data in the UI.
 * @param {string} url
 * @param {AbortSignal} [signal]
 * @param {Array} [accumulatedResults]
 * @returns {Promise<Array>}
 */
const fetchAllPages = async (url, signal, accumulatedResults = []) => {
  const response = await fetch(url, { signal });
  const jsonData = await response.json();
  const combinedResults = [...accumulatedResults, ...(jsonData.results || [])];
  if (jsonData.next) {
    return fetchAllPages(jsonData.next, signal, combinedResults);
  }
  if (typeof jsonData.count === 'number' && jsonData.count !== combinedResults.length) {
    console.warn(`API pagination mismatch for ${url}: expected ${jsonData.count} results, received ${combinedResults.length}`);
  }
  return combinedResults;
};

export default fetchAllPages;
