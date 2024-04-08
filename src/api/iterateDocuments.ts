import IRowData, { RowId } from "../model/IRowData";

import sleep from "../utils/sleep";

const TOTAL_DOCUMENTS = 10_000;
const REQUEST_LIMIT = 5_000;
const REQUEST_DELAY = 100;

/**
 * Represents a configuration interface for data retrieval.
 * @template Data - The type of row data.
 */
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
 * @param config - The configuration object.
 * @param [config.totalDocuments=TOTAL_DOCUMENTS] - The total number of documents to iterate over.
 * @param [config.limit=REQUEST_LIMIT] - The number of documents to fetch in each request.
 * @param [config.delay=REQUEST_DELAY] - The delay between each request.
 * @param [config.createRequest=() => []] - The function used to create the request.
 *
 * @returns An asynchronous generator that yields an array of documents.
 *
 * @throws If the response length is greater than the specified limit.
 */
export const iterateDocuments = async function* <Data extends IRowData = IRowData>({
  totalDocuments = TOTAL_DOCUMENTS,
  limit = REQUEST_LIMIT,
  delay = REQUEST_DELAY,
  createRequest = () => [],
}: IConfig<Data>): AsyncGenerator<Data[], void, unknown> {

  /**
   * Creates a request and returns the result asynchronously.
   *
   * @name createRequest
   * @function
   * @param args - The arguments to pass to the createRequest function.
   * @returns A promise that resolves to the result of the request.
   */
  const request: typeof createRequest = async (...args) => {
    const [result] = await Promise.all([
      createRequest(...args),
      sleep(delay),
    ]);
    return result;
  };

  let counter = 0;
  let lastId = null;

  /**
   * Represents the last query made to the server.
   *
   * @typedef LastQuery
   * @property lastId - The ID of the last object fetched. Defaults to null.
   * @property offset - The offset used in pagination. Defaults to 0.
   * @property page - The current page number. Defaults to 0.
   * @property limit - The maximum number of objects to fetch per request.
   */
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
    /**
     * Represents the last query made by the user.
     * @class
     */
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
