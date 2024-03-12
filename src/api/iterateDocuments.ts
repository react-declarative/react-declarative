import IRowData, { RowId } from "../model/IRowData";

import sleep from "../utils/sleep";

const TOTAL_DOCUMENTS = 10_000;
const REQUEST_LIMIT = 5_000;
const REQUEST_DELAY = 100;

interface IConfig<Data extends IRowData = IRowData> {
  totalDocuments?: number;
  limit?: number;
  delay?: number;
  createRequest: (data: {
    limit: number;
    offset: number;
    page: number;
    lastId: RowId | null;
  } & Omit<IConfig<Data>, 'createRequest'>) => (Data[] | Promise<Data[]>);
}

/**
 * Asynchronous generator function that iterates over documents.
 *
 * @template Data - The type of the row data in the documents.
 *
 * @param {Object} config - The configuration object.
 * @param {number} [config.totalDocuments=TOTAL_DOCUMENTS] - The total number of documents to iterate over.
 * @param {number} [config.limit=REQUEST_LIMIT] - The number of documents to fetch in each request.
 * @param {number} [config.delay=REQUEST_DELAY] - The delay between each request.
 * @param {Function} [config.createRequest=() => []] - The function used to create the request.
 *
 * @returns {AsyncGenerator} An asynchronous generator that yields an array of documents.
 *
 * @throws {Error} If the response length is greater than the specified limit.
 */
export const iterateDocuments = async function* <Data extends IRowData = IRowData>({
  totalDocuments = TOTAL_DOCUMENTS,
  limit = REQUEST_LIMIT,
  delay = REQUEST_DELAY,
  createRequest = () => [],
}: IConfig<Data>): AsyncGenerator<Data[], void, unknown> {

  const request: typeof createRequest = async (...args) => {
    const [result] = await Promise.all([
      createRequest(...args),
      sleep(delay),
    ]);
    return result;
  };

  let counter = 0;
  let lastId = null;

  let lastQuery = request({
    lastId: null,
    offset: 0,
    page: 0,
    limit,
  });

  while (counter < totalDocuments) {
    const response = await lastQuery;
    if (response.length < limit) {
      yield response;
      break;
    }
    if (response.length > limit) {
      throw new Error('react-declarative iterateDocuments response.length > limit');
    }
    lastId = response[response.length - 1].id || null;
    counter += limit;
    lastQuery = request({
      lastId,
      offset: counter,
      page: counter / limit,
      limit,
    });
    yield response;
  }

};

export default iterateDocuments;
