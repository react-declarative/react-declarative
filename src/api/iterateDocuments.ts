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
    lastId: RowId | null;
  } & Omit<IConfig<Data>, 'createRequest'>) => (Data[] | Promise<Data[]>);
}

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
    limit,
  });

  while (counter < totalDocuments) {
    const response = await lastQuery;
    if (response.length < limit) {
      yield response;
      break;
    }
    lastId = response[response.length - 1].id || null;
    counter += response.length;
    lastQuery = request({
      lastId,
      offset: counter,
      limit,
    });
    yield response;
  }

};

export default iterateDocuments;
